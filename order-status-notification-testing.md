# Order Status Notification Testing Guide

This guide explains how to test the enhanced order status notification system that alerts customers when admins update the status of their ordered products.

## Prerequisites

1. Two browser windows or tabs:
   - One for the admin dashboard (admin-dashboard.html)
   - One for the customer view (home.html, products.html, or profile.html)

2. Two different accounts:
   - Admin account (email ending with @tastemaker.com)
   - Customer account (any email)

## Testing Steps

### Step 1: Setup

1. Open two browser windows or tabs
2. In the first window, log in as an admin
3. In the second window, log in as a customer
4. Place an order as the customer (if you don't already have orders)

### Step 2: Update Order Status as Admin

1. In the admin window, go to the Orders tab
2. Find the order you want to update
3. Click "View" to open the order details
4. Select a new status from the dropdown (e.g., "Accepted", "Shipped", etc.)
5. Click "Update Status"
6. Confirm the status update

### Step 3: Verify Notifications as Customer

1. In the customer window, you should see:
   - A toast notification appearing in the top-right corner
   - The notification bell showing a red badge with the number of unread notifications
   - The bell icon animating to draw attention
   - A sound playing to alert you

2. Click on the notification bell to see the notification in the dropdown
3. Verify that the notification shows the correct order status

### Step 4: Test Different Status Updates

Repeat Steps 2-3 with different status updates:
- Accepted
- Rejected
- Shipped
- Delivered
- Cancelled

### Step 5: Test Notification Persistence

1. Refresh the customer page
2. Verify that the notification count persists
3. Click on the notification bell to see all notifications
4. Click "Mark all as read" to clear notifications
5. Verify that the notification count disappears

## Troubleshooting

If notifications are not appearing:

### Check Console Logs

1. Open the browser developer console (F12 or right-click > Inspect)
2. Look for any error messages
3. Check for logs from the notification system:
   - "Creating notification for user..."
   - "Notification saved with key..."
   - "New notification received..."
   - "Toast notification shown for..."

### Check Firebase Database

1. Go to the Firebase console
2. Navigate to the Realtime Database
3. Check the following paths:
   - `users/{userId}/notifications`
   - `users/{userId}/orders/{orderId}`
   - `centralNotifications`

### Check Notification Permissions

1. Check if browser notifications are enabled
2. Look for the notification permission status in the console
3. Try requesting permission again if needed

## Common Issues and Solutions

### Issue: Notifications not appearing

**Solutions:**
- Make sure you're logged in as the correct user
- Check that the order belongs to the logged-in user
- Verify that the order status was actually updated
- Check console for errors

### Issue: Notification count not updating

**Solutions:**
- Check if the notification bell element exists on the page
- Verify that the notification count element exists
- Check if the updateNotificationBell function is being called

### Issue: Toast notifications not showing

**Solutions:**
- Check if the toast container is being created
- Verify that the showOrderStatusToast function is being called
- Check for CSS conflicts that might hide the toast

### Issue: Sound not playing

**Solutions:**
- Check if the notification-sound.js file is included
- Verify that the playNotificationSound function exists
- Check if the browser allows autoplay of audio

## Expected Behavior

When an admin updates an order status:

1. The admin dashboard shows a success message
2. The order status is updated in the Firebase database
3. A notification is created in the customer's notifications collection
4. The customer sees a toast notification
5. The notification bell shows a red badge with the count
6. The bell animates to draw attention
7. A sound plays to alert the customer
8. The notification appears in the dropdown when clicking the bell
