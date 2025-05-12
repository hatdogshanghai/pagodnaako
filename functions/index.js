const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});

admin.initializeApp();

// Configure the email transporter
// For Gmail, you'll need to create an "App Password" in your Google Account settings
// Go to: Google Account > Security > 2-Step Verification > App passwords
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // REPLACE WITH YOUR EMAIL
    pass: 'your-app-password'     // REPLACE WITH YOUR APP PASSWORD
  }
});

// Cloud Function to send OTP via email
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
      from: 'Yogee App <your-email@gmail.com>', // REPLACE WITH YOUR EMAIL
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
            <p>&copy; ${new Date().getFullYear()} Yogee App. All rights reserved.</p>
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

// Cloud Function to automatically assign admin role to users with @yogee.com email
exports.assignAdminRole = functions.auth.user().onCreate(async (user) => {
  // Check if the user's email exists and ends with '@yogee.com'
  if (user.email && user.email.endsWith('@yogee.com')) {
    try {
      // User has a @yogee.com email, assign them the 'admin' custom claim
      await admin.auth().setCustomUserClaims(user.uid, {
        admin: true
      });

      // Also add the user to the adminUsers collection in the database for easier querying
      await admin.database().ref(`adminUsers/${user.uid}`).set({
        email: user.email,
        createdAt: admin.database.ServerValue.TIMESTAMP
      });

      console.log(`Admin role assigned to user: ${user.email} (${user.uid})`);
      return { success: true };
    } catch (error) {
      console.error('Error setting admin role:', error);
      return { success: false, error: error.message };
    }
  } else {
    // User does not have a @yogee.com email, they are not an admin
    console.log(`User ${user.email || 'unknown'} (${user.uid}) is not eligible for admin role.`);
    return { success: true, isAdmin: false };
  }
});
