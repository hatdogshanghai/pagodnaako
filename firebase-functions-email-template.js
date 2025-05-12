/**
 * Firebase Cloud Functions Template for Sending OTP Emails
 * 
 * This file provides a template for implementing email sending functionality
 * using Firebase Cloud Functions. To use this:
 * 
 * 1. Set up Firebase Cloud Functions in your project
 * 2. Install required dependencies: nodemailer, cors
 * 3. Configure your email service credentials
 * 4. Deploy the function to Firebase
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

admin.initializeApp();

/**
 * Configure your email service
 * You can use services like:
 * - Gmail (with app password)
 * - SendGrid
 * - Mailgun
 * - Amazon SES
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password' // Use app password for Gmail
  }
});

/**
 * Cloud Function to send OTP via email
 * This function can be called from your frontend code
 */
exports.sendOTPEmail = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to request OTP.'
    );
  }

  const { email, otpCode } = data;
  
  if (!email || !otpCode) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Email and OTP code are required.'
    );
  }

  try {
    // Create email content with OTP
    const mailOptions = {
      from: 'Your App <noreply@yourdomain.com>',
      to: email,
      subject: 'Your Password Reset Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4263eb; text-align: center;">Password Reset Verification</h2>
          <p>You requested to change your password. Use the following code to verify your identity:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h1 style="font-size: 32px; letter-spacing: 5px; margin: 0; color: #333;">${otpCode}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email or contact support if you have concerns.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #777; font-size: 12px;">
            <p>This is an automated email. Please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} Your App Name. All rights reserved.</p>
          </div>
        </div>
      `
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    
    return { success: true, message: 'OTP email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Error sending OTP email. Please try again.'
    );
  }
});

/**
 * Alternative: HTTP endpoint for sending OTP
 * This can be called from your frontend using fetch/axios
 */
exports.sendOTPEmailHTTP = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    // Check if request method is POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get request body
    const { email, otpCode, idToken } = req.body;
    
    if (!email || !otpCode || !idToken) {
      return res.status(400).json({ error: 'Email, OTP code, and ID token are required' });
    }

    try {
      // Verify the ID token
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;
      
      // Create email content with OTP
      const mailOptions = {
        from: 'Your App <noreply@yourdomain.com>',
        to: email,
        subject: 'Your Password Reset Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #4263eb; text-align: center;">Password Reset Verification</h2>
            <p>You requested to change your password. Use the following code to verify your identity:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
              <h1 style="font-size: 32px; letter-spacing: 5px; margin: 0; color: #333;">${otpCode}</h1>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email or contact support if you have concerns.</p>
          </div>
        `
      };

      // Send the email
      await transporter.sendMail(mailOptions);
      
      return res.status(200).json({ success: true, message: 'OTP email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Error sending OTP email' });
    }
  });
});

/**
 * To call these functions from your frontend:
 * 
 * 1. For the callable function:
 * 
 * import { getFunctions, httpsCallable } from 'firebase/functions';
 * 
 * const functions = getFunctions();
 * const sendOTPEmail = httpsCallable(functions, 'sendOTPEmail');
 * 
 * // Then call it
 * sendOTPEmail({ email: user.email, otpCode: generatedOTP })
 *   .then((result) => {
 *     console.log('Email sent successfully');
 *   })
 *   .catch((error) => {
 *     console.error('Error sending email:', error);
 *   });
 * 
 * 2. For the HTTP endpoint:
 * 
 * // Get the user's ID token
 * const idToken = await currentUser.getIdToken();
 * 
 * // Call the HTTP endpoint
 * fetch('https://your-region-your-project.cloudfunctions.net/sendOTPEmailHTTP', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json'
 *   },
 *   body: JSON.stringify({
 *     email: user.email,
 *     otpCode: generatedOTP,
 *     idToken: idToken
 *   })
 * })
 * .then(response => response.json())
 * .then(data => console.log('Email sent successfully'))
 * .catch(error => console.error('Error sending email:', error));
 */
