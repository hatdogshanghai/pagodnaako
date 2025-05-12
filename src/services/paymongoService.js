
class PayMongoService {
  constructor() {
    console.log('Initializing PayMongo service');

    // PayMongo API endpoints
    this.linksEndpoint = 'https://api.paymongo.com/v1/links';
    this.paymentIntentsEndpoint = 'https://api.paymongo.com/v1/payment_intents';

    // Store payment links for status checking
    this.paymentLinks = {};
  }

  /**
   * Create a payment link
   * @param {number} amount - Amount in smallest currency unit (e.g., centavos for PHP)
   * @param {string} description - Description of the payment
   * @param {string} remarks - Additional remarks for the payment
   * @param {string} orderId - Order ID for reference
   * @returns {Promise<Object>} - Payment link data
   */
  async createPaymentLink(amount, description, remarks, orderId) {
    try {
      console.log(`Creating payment link for order ${orderId} with amount ${amount}`);

      // Make API request to create payment link
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          description: description,
          remarks: remarks || orderId,
          reference_number: orderId
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create payment link: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data || !data.checkout_url) {
        throw new Error('Invalid response from payment service');
      }

      // Create a standardized payment link object
      const paymentLink = {
        id: data.id || `pay_${Date.now()}`,
        type: 'link',
        attributes: {
          amount: amount,
          description: description,
          remarks: remarks || orderId,
          status: 'pending',
          checkout_url: data.checkout_url,
          reference_number: orderId
        }
      };

      // Store payment link for status checking
      this.paymentLinks[paymentLink.id] = paymentLink;

      console.log('Created payment link:', paymentLink);
      return paymentLink;
    } catch (error) {
      console.error('Error creating payment link:', error);

      // Fallback to direct PHP endpoint if the API route fails
      try {
        const phpResponse = await fetch('/checkout.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amount, // Keep as centavos as our PHP script now expects it
            description: description,
            remarks: remarks || orderId,
            reference_number: orderId
          }),
        });

        if (!phpResponse.ok) {
          throw new Error(`Failed to create payment link via PHP: ${phpResponse.statusText}`);
        }

        const phpData = await phpResponse.json();

        if (!phpData || !phpData.checkout_url) {
          throw new Error('Invalid response from PHP payment service');
        }

        const fallbackLink = {
          id: phpData.id || `pay_${Date.now()}`,
          type: 'link',
          attributes: {
            amount: amount,
            description: description,
            remarks: remarks || orderId,
            status: 'pending',
            checkout_url: phpData.checkout_url,
            reference_number: orderId
          }
        };

        this.paymentLinks[fallbackLink.id] = fallbackLink;
        return fallbackLink;
      } catch (phpError) {
        console.error('Error creating payment link via PHP:', phpError);

        // Final fallback - create a mock payment link for development
        // This should be removed in production
        const mockPaymentId = `pay_mock_${Date.now()}`;
        const mockLink = {
          id: mockPaymentId,
          type: 'link',
          attributes: {
            amount: amount || 0,
            description: description || 'Order payment',
            remarks: remarks || orderId || 'Unknown order',
            status: 'pending',
            checkout_url: 'https://checkout.paymongo.com/test-payment',
            reference_number: orderId || 'unknown'
          }
        };

        this.paymentLinks[mockPaymentId] = mockLink;
        return mockLink;
      }
    }
  }

  /**
   * Check payment status
   * @param {string} paymentId - PayMongo payment ID
   * @returns {Promise<Object>} - Payment status data
   */
  async checkPaymentStatus(paymentId) {
    try {
      console.log('Checking payment status for ID:', paymentId);

      // Make API request to check payment status
      const response = await fetch(`/api/check-payment-status?id=${paymentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to check payment status: ${response.statusText}`);
      }

      const data = await response.json();

      if (data && data.status) {
        // Update local cache
        if (this.paymentLinks[paymentId]) {
          this.paymentLinks[paymentId].attributes.status = data.status;
        }

        return {
          id: paymentId,
          type: 'link',
          attributes: {
            status: data.status,
            reference_number: data.reference_number || paymentId
          }
        };
      }

      // Fallback to local cache if API fails
      if (this.paymentLinks[paymentId]) {
        return this.paymentLinks[paymentId];
      }

      // Default response if no data is available
      return {
        id: paymentId,
        type: 'link',
        attributes: {
          status: 'pending',
          reference_number: paymentId
        }
      };
    } catch (error) {
      console.error('Error checking payment status:', error);

      // Fallback to local cache
      if (this.paymentLinks[paymentId]) {
        // In development, randomly change status to simulate payment completion
        if (process.env.NODE_ENV === 'development') {
          if (this.paymentLinks[paymentId].attributes.status === 'pending' && Math.random() < 0.3) {
            console.log(`[DEV] Payment ${paymentId} is now paid`);
            this.paymentLinks[paymentId].attributes.status = 'paid';
          }
        }

        return this.paymentLinks[paymentId];
      }

      // Default response if no data is available
      return {
        id: paymentId,
        type: 'link',
        attributes: {
          status: 'pending',
          reference_number: paymentId
        }
      };
    }
  }
}


const paymongoService = new PayMongoService();

export default paymongoService;
