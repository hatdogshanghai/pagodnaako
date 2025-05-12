# Order Notification System

This document explains the new order notification system that connects the admin dashboard with the checkout process, allowing admins to accept orders and notify customers.

## Overview

The system consists of the following components:

1. **Order Status Workflow**: Orders now follow a clear workflow from "Pending" to "Accepted" to "Shipped" to "Delivered".
2. **Admin Dashboard**: Admins can view, accept, reject, and manage orders.
3. **Notification System**: Customers receive notifications when their order status changes.
4. **Profile Page**: Customers can view their order history and notifications.

## Order Status Workflow

Orders now follow this workflow:

1. **Pending**: Initial state when a customer places an order
2. **Accepted**: Admin has reviewed and accepted the order
3. **Preparing**: Order is being prepared
4. **Ready for Pickup**: Order is ready for pickup or delivery
5. **Out for Delivery**: Order is on its way to the customer
6. **Shipped**: Order has been shipped
7. **Delivered**: Order has been delivered to the customer
8. **Completed**: Order is complete
9. **Rejected**: Admin has rejected the order
10. **Cancelled**: Order has been cancelled by the customer or admin
11. **Refunded**: Order has been refunded

## Admin Dashboard

The admin dashboard has been updated with the following features:

1. **View Orders**: Admins can view all orders in the system.
2. **Update Order Status**: Admins can update the status of an order from the dropdown menu.
3. **Notifications**: Admins receive notifications when new orders are placed.

### How to Use the Admin Dashboard

1. Log in with your admin credentials (email must end with @tastemaker.com).
2. Navigate to the "View Orders" section.
3. Click on an order to view its details.
4. Use the status dropdown to update the order status.
5. Click "Update Status" to save the changes.

## Customer Notifications

Customers receive notifications in the following scenarios:

1. **Order Placed**: When they place a new order.
2. **Order Accepted**: When an admin accepts their order.
3. **Order Rejected**: When an admin rejects their order.
4. **Order Shipped**: When their order is shipped.
5. **Order Delivered**: When their order is delivered.
6. **Order Cancelled**: When their order is cancelled.

### How Notifications Work

1. Notifications appear in the bell icon in the profile page.
2. Unread notifications are highlighted and counted.
3. Clicking on a notification marks it as read.
4. Clicking "Mark all as read" marks all notifications as read.

## Firebase Database Structure

The notification system uses the following Firebase database structure:

```
users/
  {userId}/
    notifications/
      {notificationId}/
        userId: string
        orderId: string
        type: string
        message: string
        read: boolean
        createdAt: number
        oldStatus: string (optional)
        newStatus: string (optional)

centralNotifications/
  {notificationId}/
    userId: string
    orderId: string
    type: string
    message: string
    read: boolean
    createdAt: number
    forAdmin: boolean
    oldStatus: string (optional)
    newStatus: string (optional)
```

## Implementation Details

1. **checkout.html**: Creates a notification when an order is placed.
2. **admin-dashboard.js**: Creates notifications when order status is updated.
3. **profile.html**: Displays notifications to the customer.
4. **notifications.js**: Contains utility functions for managing notifications.

## Security Rules

Make sure your Firebase security rules allow read/write access to the notifications:

```json
{
  "rules": {
    "users": {
      "$uid": {
        "notifications": {
          ".read": "$uid === auth.uid || root.child('adminUsers').child(auth.uid).exists()",
          ".write": "$uid === auth.uid || root.child('adminUsers').child(auth.uid).exists()"
        }
      }
    },
    "centralNotifications": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

## Troubleshooting

If notifications are not appearing:

1. Check that you're logged in.
2. Check the browser console for errors.
3. Verify that the Firebase security rules allow access to the notifications.
4. Try refreshing the page.

If order status updates are not working:

1. Check that you have admin privileges.
2. Check the browser console for errors.
3. Verify that the Firebase security rules allow access to the orders.
