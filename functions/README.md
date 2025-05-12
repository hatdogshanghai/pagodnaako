# Firebase Cloud Functions for Email OTP

This directory contains the Firebase Cloud Functions code for sending OTP emails for password reset functionality.

## Setup Instructions

### 1. Install Firebase CLI

If you haven't already, install the Firebase CLI:

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Firebase in your project (if not already done)

```bash
firebase init
```

Select "Functions" when prompted for which Firebase features to set up.

### 4. Configure Email Credentials

Open `index.js` and update the email configuration:

```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // REPLACE WITH YOUR EMAIL
    pass: 'your-app-password'     // REPLACE WITH YOUR APP PASSWORD
  }
});
```

For Gmail, you'll need to:
1. Enable 2-Step Verification in your Google Account
2. Generate an App Password:
   - Go to your Google Account
   - Select Security
   - Under "Signing in to Google," select App Passwords
   - Generate a new app password for "Mail" and "Other (Custom name)"
   - Use this password in the configuration

### 5. Install Dependencies

```bash
cd functions
npm install
```

### 6. Deploy the Functions

```bash
firebase deploy --only functions
```

## Testing the Function

After deployment, you can test the function by:

1. Making sure your frontend code is correctly calling the Cloud Function
2. Checking the Firebase Functions logs in the Firebase Console
3. Sending a test OTP and verifying it arrives in the specified email

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
