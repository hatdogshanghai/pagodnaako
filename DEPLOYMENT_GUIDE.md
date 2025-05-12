# Deployment Guide for OTP Email Functionality

This guide will help you set up and deploy the OTP email functionality for password reset in your application.

## Prerequisites

- Firebase project with Authentication, Realtime Database, and Functions enabled
- Gmail account (or other email service) for sending emails
- Node.js and npm installed

## Step 1: Set Up Firebase Cloud Functions

### 1.1 Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 1.2 Login to Firebase

```bash
firebase login
```

### 1.3 Initialize Firebase in your project (if not already done)

```bash
firebase init
```

Select "Functions" when prompted for which Firebase features to set up.

## Step 2: Configure Email Sending

### 2.1 Update Email Configuration

Open `functions/index.js` and update the email configuration:

```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // REPLACE WITH YOUR EMAIL
    pass: 'your-app-password'     // REPLACE WITH YOUR APP PASSWORD
  }
});
```

### 2.2 Set Up Gmail App Password

For Gmail, you'll need to:
1. Enable 2-Step Verification in your Google Account
   - Go to your Google Account > Security
   - Enable 2-Step Verification if not already enabled
2. Generate an App Password:
   - Go to your Google Account > Security
   - Under "Signing in to Google," select App Passwords
   - Select "Mail" and "Other (Custom name)"
   - Use the generated password in your configuration

## Step 3: Configure Admin Role Assignment

### 3.1 Admin Role Assignment Function

The application includes a Cloud Function that automatically assigns admin roles to users with @yogee.com email addresses. This function is defined in `functions/index.js`:

```javascript
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
```

This function:
1. Triggers when a new user is created
2. Checks if the user's email ends with @yogee.com
3. If it does, assigns the 'admin' custom claim to the user
4. Also adds the user to the adminUsers collection in the database

### 3.2 Install Dependencies

```bash
cd functions
npm install
```

### 3.3 Deploy the Functions

```bash
firebase deploy --only functions
```

## Step 4: Update Frontend Configuration

### 4.1 Ensure Firebase Functions are Imported

Make sure your frontend code has the necessary imports:

```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';
```

### 4.2 Update Firebase Configuration

Ensure your Firebase configuration in `src/services/firebase.js` includes the functions initialization:

```javascript
import { getFunctions } from 'firebase/functions';

// Initialize Firebase functions
export const functions = getFunctions(app);
```

## Step 5: Test the Functionality

1. Navigate to the profile page
2. Click on "Change Password"
3. Click "Send OTP"
4. Check the email account for the verification code
5. Enter the code and verify it works
6. Complete the password change process

## Troubleshooting

### Common Issues:

1. **Email not sending**:
   - Check if your email and app password are correct
   - Ensure your Gmail account allows less secure apps or is properly set up with App Passwords
   - Check Firebase Functions logs for errors

2. **Function deployment fails**:
   - Make sure you have the correct billing plan (Blaze plan is required for external network requests)
   - Check for syntax errors in your code

3. **Function not being called**:
   - Verify the function name in your frontend code matches the deployed function name
   - Check browser console for any errors when calling the function

### Viewing Logs

To view logs for debugging:

```bash
firebase functions:log
```

Or check the Firebase Console > Functions > Logs.

## Security Considerations

### OTP Security
1. **OTP Expiration**: OTPs expire after 10 minutes for security
2. **One-time Use**: Each OTP can only be used once
3. **User Authentication**: Only authenticated users can request OTPs
4. **Rate Limiting**: Consider adding rate limiting to prevent abuse

### Admin Role Security
1. **Email Domain Restriction**: Only users with @yogee.com email addresses can be assigned admin roles
2. **Custom Claims**: Admin roles are assigned using Firebase Auth custom claims, which are secure and cannot be modified by clients
3. **Multiple Verification Layers**: The application checks for admin status in multiple ways:
   - Firebase Auth custom claims (primary method)
   - Database role field (secondary method)
   - adminUsers collection (tertiary method)
4. **Session Management**: Admin sessions are tracked separately from regular user sessions

## Production Considerations

1. **Email Templates**: Customize the email templates to match your brand
2. **Email Service**: For production, consider using a dedicated email service like SendGrid or Mailgun
3. **Error Handling**: Implement more robust error handling and retry mechanisms
4. **Monitoring**: Set up monitoring for your Firebase Functions to track usage and errors
