# Notification System Guide

This document explains the notification system that has been implemented across the website, allowing customers to receive real-time updates about their orders.

## Overview

The notification system provides the following features:

1. A notification bell icon in the header next to the cart icon
2. Real-time notifications when order status changes
3. Unread notification counter
4. Notification dropdown with a list of all notifications
5. Ability to mark notifications as read

## Implementation Details

### Components

1. **Notification Bell**: Located in the header next to the cart icon on all pages (home, products, profile)
2. **Notification Counter**: Shows the number of unread notifications
3. **Notification Dropdown**: Displays all notifications with the newest at the top
4. **Mark All as Read Button**: Allows users to mark all notifications as read at once

### Pages with Notification System

The notification system has been implemented on the following pages:

- Home page (home.html)
- Products page (products.html)
- Profile page (profile.html)

### Firebase Integration

The notification system is integrated with Firebase Realtime Database:

- Notifications are stored in the user's profile under `users/{userId}/notifications`
- Each notification has a unique ID and contains information about the order status change
- Notifications are updated in real-time using Firebase's real-time listeners

## How It Works

### For Customers

1. When an admin changes the status of an order, a notification is created for the customer
2. The notification bell shows a counter with the number of unread notifications
3. Clicking on the notification bell opens a dropdown with all notifications
4. Clicking on a notification marks it as read and navigates to the related order (if on profile page)
5. Clicking "Mark all as read" marks all notifications as read

### For Admins

1. When updating an order status in the admin dashboard, the system automatically creates a notification for the customer
2. The notification includes details about the status change and a reference to the order

## Notification Types

The system supports the following notification types:

1. **Order Accepted**: When an admin accepts an order
2. **Order Rejected**: When an admin rejects an order
3. **Order Shipped**: When an order is marked as shipped
4. **Order Delivered**: When an order is marked as delivered
5. **Order Cancelled**: When an order is cancelled

## Technical Implementation

### Files

1. **global-notifications.js**: Contains the core notification functionality for all pages
2. **style.css**: Contains the styles for the notification components
3. **home.html**, **products.html**, **profile.html**: Include the notification bell in the header

### JavaScript Functions

1. `loadUserNotifications(userId)`: Loads and displays notifications for a user
2. `markNotificationAsRead(userId, notificationId)`: Marks a specific notification as read
3. `markAllNotificationsAsRead(userId)`: Marks all notifications as read

## Customization

The notification system can be customized in the following ways:

1. **Appearance**: Modify the CSS in style.css to change colors, sizes, and animations
2. **Behavior**: Modify global-notifications.js to change how notifications are displayed and interacted with
3. **Types**: Add new notification types in the admin dashboard for different status changes

## Troubleshooting

If notifications are not appearing:

1. Make sure the user is logged in
2. Check the browser console for errors
3. Verify that Firebase is properly initialized
4. Check that the notification bell is properly added to the page
5. Verify that the user has notifications in the Firebase database

If notifications are not being marked as read:

1. Check that the Firebase write permissions are properly set
2. Verify that the notification ID is correct
3. Check the browser console for errors

## Future Enhancements

Potential future enhancements for the notification system:

1. Push notifications for mobile devices
2. Email notifications for important status changes
3. Notification preferences to allow users to choose which notifications they receive
4. Notification grouping for multiple updates to the same order
5. Notification expiration to automatically remove old notifications
