// Notifications System for Yogee
// This file handles notifications between admin and customers

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getDatabase, ref, push, get, set, update, onValue, remove } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAe_9cLfhCyt9ACJcndpZrn6FslK8v83Rk",
    authDomain: "yogeelogin.firebaseapp.com",
    databaseURL: "https://yogeelogin-default-rtdb.firebaseio.com",
    projectId: "yogeelogin",
    storageBucket: "yogeelogin.appspot.com",
    messagingSenderId: "48290836478",
    appId: "1:48290836478:web:8b43881d88456ad9659aaf"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Notification Types
const NOTIFICATION_TYPES = {
    ORDER_PLACED: 'order_placed',
    ORDER_ACCEPTED: 'order_accepted',
    ORDER_REJECTED: 'order_rejected',
    ORDER_SHIPPED: 'order_shipped',
    ORDER_DELIVERED: 'order_delivered',
    ORDER_CANCELLED: 'order_cancelled',
    PAYMENT_RECEIVED: 'payment_received',
    GENERAL: 'general'
};

// Create a notification for a user
export async function createNotification(userId, orderId, type, message, additionalData = {}) {
    try {
        if (!userId) {
            console.error('User ID is required to create a notification');
            return false;
        }

        const notificationData = {
            userId,
            orderId: orderId || null,
            type,
            message,
            read: false,
            createdAt: Date.now(),
            ...additionalData
        };

        // Save to user's notifications
        const userNotificationsRef = ref(database, `users/${userId}/notifications`);
        await push(userNotificationsRef, notificationData);

        // If it's an order notification, also save to centralNotifications for admin
        if (orderId) {
            const centralNotificationsRef = ref(database, 'centralNotifications');
            await push(centralNotificationsRef, {
                ...notificationData,
                forAdmin: type === NOTIFICATION_TYPES.ORDER_PLACED
            });
        }

        return true;
    } catch (error) {
        console.error('Error creating notification:', error);
        return false;
    }
}

// Get notifications for a user
export async function getUserNotifications(userId) {
    try {
        const userNotificationsRef = ref(database, `users/${userId}/notifications`);
        const snapshot = await get(userNotificationsRef);
        
        if (snapshot.exists()) {
            const notifications = [];
            snapshot.forEach(childSnapshot => {
                notifications.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            
            // Sort by creation time (newest first)
            return notifications.sort((a, b) => b.createdAt - a.createdAt);
        }
        
        return [];
    } catch (error) {
        console.error('Error getting user notifications:', error);
        return [];
    }
}

// Get admin notifications
export async function getAdminNotifications() {
    try {
        const centralNotificationsRef = ref(database, 'centralNotifications');
        const snapshot = await get(centralNotificationsRef);
        
        if (snapshot.exists()) {
            const notifications = [];
            snapshot.forEach(childSnapshot => {
                const notification = childSnapshot.val();
                if (notification.forAdmin) {
                    notifications.push({
                        id: childSnapshot.key,
                        ...notification
                    });
                }
            });
            
            // Sort by creation time (newest first)
            return notifications.sort((a, b) => b.createdAt - a.createdAt);
        }
        
        return [];
    } catch (error) {
        console.error('Error getting admin notifications:', error);
        return [];
    }
}

// Mark a notification as read
export async function markNotificationAsRead(userId, notificationId) {
    try {
        const notificationRef = ref(database, `users/${userId}/notifications/${notificationId}`);
        await update(notificationRef, { read: true });
        return true;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        return false;
    }
}

// Delete a notification
export async function deleteNotification(userId, notificationId) {
    try {
        const notificationRef = ref(database, `users/${userId}/notifications/${notificationId}`);
        await remove(notificationRef);
        return true;
    } catch (error) {
        console.error('Error deleting notification:', error);
        return false;
    }
}

// Listen for new notifications for a user
export function listenForNotifications(userId, callback) {
    if (!userId) return null;
    
    const userNotificationsRef = ref(database, `users/${userId}/notifications`);
    const unsubscribe = onValue(userNotificationsRef, (snapshot) => {
        const notifications = [];
        if (snapshot.exists()) {
            snapshot.forEach(childSnapshot => {
                notifications.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
        }
        
        // Sort by creation time (newest first)
        const sortedNotifications = notifications.sort((a, b) => b.createdAt - a.createdAt);
        callback(sortedNotifications);
    });
    
    return unsubscribe;
}

// Create notification for order status change
export async function notifyOrderStatusChange(userId, orderId, newStatus, oldStatus) {
    let type, message;
    
    switch (newStatus.toLowerCase()) {
        case 'accepted':
            type = NOTIFICATION_TYPES.ORDER_ACCEPTED;
            message = `Your order #${orderId.slice(-6)} has been accepted and is being processed.`;
            break;
        case 'rejected':
            type = NOTIFICATION_TYPES.ORDER_REJECTED;
            message = `Your order #${orderId.slice(-6)} has been rejected. Please contact customer support for more information.`;
            break;
        case 'shipped':
            type = NOTIFICATION_TYPES.ORDER_SHIPPED;
            message = `Your order #${orderId.slice(-6)} has been shipped and is on its way to you!`;
            break;
        case 'delivered':
            type = NOTIFICATION_TYPES.ORDER_DELIVERED;
            message = `Your order #${orderId.slice(-6)} has been delivered. Enjoy!`;
            break;
        case 'cancelled':
            type = NOTIFICATION_TYPES.ORDER_CANCELLED;
            message = `Your order #${orderId.slice(-6)} has been cancelled.`;
            break;
        default:
            type = NOTIFICATION_TYPES.GENERAL;
            message = `Your order #${orderId.slice(-6)} status has been updated to ${newStatus}.`;
    }
    
    return await createNotification(userId, orderId, type, message, {
        oldStatus,
        newStatus
    });
}

// Export notification types
export { NOTIFICATION_TYPES };
