/**
 * Payment API Routes
 *
 * This file contains Express routes for handling payment-related API requests.
 * It serves as a proxy between the frontend and the PayMongo API to keep API keys secure.
 */

const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// PayMongo API configuration
const PAYMONGO_API_URL = 'https://api.paymongo.com/v1';
const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY || 'YOUR_PAYMONGO_SECRET_KEY';

// Helper function to make authenticated requests to PayMongo
async function paymongoRequest(endpoint, method = 'GET', data = null) {
  const url = `${PAYMONGO_API_URL}${endpoint}`;
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64')}`
  };

  const options = {
    method,
    headers
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.errors?.[0]?.detail || 'PayMongo API error');
    }

    return responseData;
  } catch (error) {
    console.error('PayMongo API request failed:', error);
    throw error;
  }
}

/**
 * Create a payment link
 * POST /api/create-payment
 */
router.post('/create-payment', async (req, res) => {
  try {
    const { amount, description, remarks, reference_number } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const payload = {
      data: {
        attributes: {
          amount: parseInt(amount),
          description: description || "Payment for Yogee's order",
          remarks: remarks || ''
        }
      }
    };

    if (reference_number) {
      payload.data.attributes.reference_number = reference_number;
    }

    const response = await paymongoRequest('/links', 'POST', payload);

    res.json({
      id: response.data.id,
      checkout_url: response.data.attributes.checkout_url,
      status: response.data.attributes.status,
      reference_number: response.data.attributes.reference_number || reference_number
    });
  } catch (error) {
    console.error('Error creating payment link:', error);
    res.status(500).json({ error: 'Failed to create payment link' });
  }
});

/**
 * Check payment status
 * GET /api/check-payment-status?id=pay_xxx
 */
router.get('/check-payment-status', async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Payment ID is required' });
    }

    const response = await paymongoRequest(`/links/${id}`);

    res.json({
      id: response.data.id,
      status: response.data.attributes.status,
      reference_number: response.data.attributes.reference_number || ''
    });
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
});

module.exports = router;
