/**
 * Order Status Notification System
 * This file handles notifications specifically for order status updates from admin
 */

// Define notification types
const ORDER_STATUS_TYPES = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

// Store the last checked timestamp to detect new notifications
let lastCheckedTimestamp = Date.now();

// Initialize the notification system
function initOrderStatusNotifications() {
    console.log('Attempting to initialize order status notifications...');

    // Function to check if Firebase is available and retry if not
    function checkFirebaseAndInit(retryCount = 0, maxRetries = 10) {
        // If we've tried too many times, give up
        if (retryCount >= maxRetries) {
            console.error('Firebase initialization timed out after ' + maxRetries + ' attempts. Order status notifications will not work.');
            return;
        }

        // Check if Firebase is initialized
        if (typeof firebase === 'undefined' || !firebase.auth) {
            console.log('Firebase not yet available, retrying in 500ms... (attempt ' + (retryCount + 1) + '/' + maxRetries + ')');
            // Wait and try again
            setTimeout(() => checkFirebaseAndInit(retryCount + 1, maxRetries), 500);
            return;
        }

        console.log('Firebase is available, initializing order status notifications');

        // Firebase is available, proceed with initialization
        try {
            // Check if user is logged in
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    console.log('User is logged in, starting to listen for order status updates');
                    // Start listening for order status updates
                    listenForOrderStatusUpdates(user.uid);
                } else {
                    console.log('User is not logged in, order status notifications will not be active');
                }
            });
        } catch (error) {
            console.error('Error initializing order status notifications:', error);
        }
    }

    // Start the check process
    checkFirebaseAndInit();
}

/**
 * Listen for order status updates for a specific user
 * @param {string} userId - The user ID to listen for updates
 */
function listenForOrderStatusUpdates(userId) {
    try {
        console.log(`Starting to listen for order status updates for user: ${userId}`);

        // 1. Listen for changes to user's orders
        try {
            const userOrdersRef = firebase.database().ref(`users/${userId}/orders`);

            userOrdersRef.on('child_changed', (snapshot) => {
                try {
                    const updatedOrder = snapshot.val();
                    const orderId = snapshot.key;

                    console.log(`Order changed: ${orderId}`, updatedOrder);

                    // Check if this is a status update
                    if (updatedOrder && updatedOrder.status && updatedOrder.lastUpdated) {
                        // Check if this is a new update (after our last check)
                        if (updatedOrder.lastUpdated > lastCheckedTimestamp) {
                            console.log(`New status update detected: ${updatedOrder.status} for order ${orderId}`);

                            // Create a notification for this status update
                            createOrderStatusNotification(userId, orderId, updatedOrder.status);

                            // Update the last checked timestamp
                            lastCheckedTimestamp = updatedOrder.lastUpdated;
                        }
                    }
                } catch (error) {
                    console.error('Error processing order change:', error);
                }
            }, (error) => {
                console.error('Error in order change listener:', error);
            });
        } catch (error) {
            console.error('Error setting up order change listener:', error);
        }

        // 2. Also listen directly for notifications
        try {
            const userNotificationsRef = firebase.database().ref(`users/${userId}/notifications`);

            userNotificationsRef.on('child_added', (snapshot) => {
                try {
                    const notification = snapshot.val();
                    // We're not using notificationId directly, but keeping it for debugging
                    const notificationId = snapshot.key;

                    console.log(`New notification received:`, notification);

                    // Check if this is a new notification (after our last check)
                    if (notification && notification.createdAt && notification.createdAt > lastCheckedTimestamp) {
                        // Only show toast for order status notifications
                        if (notification.type && notification.type.startsWith('order_')) {
                            // Extract status from notification type
                            const status = notification.type.replace('order_', '');
                            const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);

                            // Show toast notification
                            showOrderStatusToast(formattedStatus, notification.message);

                            // Update notification bell
                            updateNotificationBell();

                            console.log(`Toast notification shown for: ${notification.type}`);
                        }
                    }
                } catch (error) {
                    console.error('Error processing notification:', error);
                }
            }, (error) => {
                console.error('Error in notification listener:', error);
            });
        } catch (error) {
            console.error('Error setting up notification listener:', error);
        }
    } catch (error) {
        console.error('Error in listenForOrderStatusUpdates:', error);
    }
}

/**
 * Create a notification for an order status update
 * @param {string} userId - The user ID
 * @param {string} orderId - The order ID
 * @param {string} status - The new status
 */
function createOrderStatusNotification(userId, orderId, status) {
    try {
        // Format the status for display
        const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

        // Create notification data
        const notificationData = {
            userId,
            orderId,
            type: `order_${status.toLowerCase()}`,
            message: `Your order #${orderId.slice(-6)} has been ${status.toLowerCase()}.`,
            read: false,
            createdAt: Date.now(),
            status: status
        };

        // Save to user's notifications
        const userNotificationsRef = firebase.database().ref(`users/${userId}/notifications`);
        userNotificationsRef.push(notificationData);

        // Show a toast notification
        showOrderStatusToast(formattedStatus, notificationData.message);

        console.log(`Order status notification created: ${status} for order ${orderId}`);
    } catch (error) {
        console.error('Error creating order status notification:', error);
    }
}

/**
 * Show a toast notification for order status update
 * @param {string} title - The notification title
 * @param {string} message - The notification message
 */
function showOrderStatusToast(title, message) {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'order-status-toast';

    // Get icon based on status
    let icon = 'bx-bell';
    let statusColor = '#6a11cb'; // Default purple

    // Set icon and color based on status
    if (title.toLowerCase().includes('preparing')) {
        icon = 'bx-dish';
        statusColor = '#e67e22'; // Orange
    } else if (title.toLowerCase().includes('ready')) {
        icon = 'bx-check-circle';
        statusColor = '#27ae60'; // Green
    } else if (title.toLowerCase().includes('delivery')) {
        icon = 'bx-car';
        statusColor = '#3498db'; // Blue
    } else if (title.toLowerCase().includes('shipped')) {
        icon = 'bx-package';
        statusColor = '#3498db'; // Blue
    } else if (title.toLowerCase().includes('delivered')) {
        icon = 'bx-check-double';
        statusColor = '#27ae60'; // Green
    } else if (title.toLowerCase().includes('cancelled') || title.toLowerCase().includes('rejected')) {
        icon = 'bx-x-circle';
        statusColor = '#e74c3c'; // Red
    } else if (title.toLowerCase().includes('accepted')) {
        icon = 'bx-check';
        statusColor = '#2ecc71'; // Green
    } else if (title.toLowerCase().includes('processing')) {
        icon = 'bx-loader';
        statusColor = '#f39c12'; // Yellow
    } else if (title.toLowerCase().includes('refunded')) {
        icon = 'bx-money';
        statusColor = '#16a085'; // Teal
    }

    // Set toast content with custom icon and color
    toast.innerHTML = `
        <div class="toast-header" style="border-left: 4px solid ${statusColor}">
            <i class='bx ${icon}' style="color: ${statusColor}"></i>
            <span class="toast-title">${title}</span>
            <button class="toast-close">&times;</button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;

    // Add toast to container
    toastContainer.appendChild(toast);

    // Play notification sound
    if (window.playNotificationSound) {
        window.playNotificationSound();
    }

    // Add event listener to close button
    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', () => {
        toast.classList.add('toast-hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    });

    // Add event listener to navigate to profile page when toast is clicked
    toast.addEventListener('click', (e) => {
        if (!e.target.classList.contains('toast-close')) {
            window.location.href = 'profile.html';
        }
    });

    // Show the toast
    setTimeout(() => {
        toast.classList.add('toast-visible');
    }, 10);

    // Auto-hide the toast after 8 seconds (longer to give user time to read)
    setTimeout(() => {
        toast.classList.add('toast-hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 8000);
}

/**
 * Update the notification bell with animation and count
 */
function updateNotificationBell() {
    const notificationBell = document.getElementById('notification-bell');
    const notificationCount = document.getElementById('notification-count');

    if (!notificationBell || !notificationCount) {
        console.error('Notification bell elements not found');
        return;
    }

    // Get current count
    let currentCount = parseInt(notificationCount.textContent) || 0;

    // Increment count
    currentCount += 1;

    // Update count
    notificationCount.textContent = currentCount;
    notificationCount.style.display = currentCount > 0 ? 'flex' : 'none';

    // Animate bell
    notificationBell.classList.add('notification-bell-animate');

    // Play sound
    if (window.playNotificationSound) {
        window.playNotificationSound();
    }

    // Remove animation class after animation completes
    setTimeout(() => {
        notificationBell.classList.remove('notification-bell-animate');
    }, 1000);

    // Show desktop notification if permission is granted
    if (Notification.permission === "granted") {
        const notification = new Notification("Order Status Updated", {
            body: "Your order status has been updated. Click to view details.",
            icon: "yogee.png"
        });

        notification.onclick = function() {
            window.focus();
            window.location.href = 'profile.html';
        };
    }
}

// Initialize the notification system when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing order status notification system');

    // Request notification permission
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }

    // Initialize notifications
    initOrderStatusNotifications();
});

// Export functions for use in other files
// Use a try-catch to avoid errors if window is undefined
try {
    // Create a global object for order status notifications
    const orderStatusNotificationsAPI = {
        init: initOrderStatusNotifications,
        listenForUpdates: listenForOrderStatusUpdates,
        createNotification: createOrderStatusNotification,
        showToast: showOrderStatusToast,
        updateBell: updateNotificationBell
    };

    // Add it to the window object using bracket notation to avoid TypeScript warnings
    window['orderStatusNotifications'] = orderStatusNotificationsAPI;

    console.log('Order status notification functions exported to window');
} catch (error) {
    console.error('Error exporting order status notification functions:', error);
}
