/**
 * Admin Notifications System
 * This file handles notifications for the admin dashboard
 */

// Initialize Firebase if not already initialized
function initializeFirebase() {
    if (typeof firebase === 'undefined') {
        console.error('Firebase is not initialized');
        return false;
    }
    return true;
}

// Create a notification when an admin updates an order status
function createOrderStatusNotification(userId, orderId, status) {
    if (!initializeFirebase()) return;

    const database = firebase.database();
    const notificationsRef = database.ref(`users/${userId}/notifications`);

    // Get order details
    database.ref(`users/${userId}/orders/${orderId}`).once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                const order = snapshot.val();

                // Create notification object
                const notification = {
                    type: `order_${status.toLowerCase()}`,
                    title: 'Order Status Updated',
                    message: `Your order #${orderId} has been updated to: ${status}`,
                    orderId: orderId,
                    createdAt: firebase.database.ServerValue.TIMESTAMP,
                    read: false
                };

                // Save notification
                notificationsRef.push(notification)
                    .then(() => {
                        console.log(`Notification created for user ${userId} about order ${orderId}`);
                    })
                    .catch(error => {
                        console.error('Error creating notification:', error);
                    });
            }
        })
        .catch(error => {
            console.error('Error getting order details:', error);
        });
}

// Get admin notifications (orders placed, etc.)
function getAdminNotifications() {
    if (!initializeFirebase()) return;

    const database = firebase.database();
    const centralNotificationsRef = database.ref('centralNotifications');

    centralNotificationsRef.orderByChild('createdAt').limitToLast(20).on('value', snapshot => {
        if (snapshot.exists()) {
            const notifications = [];

            snapshot.forEach(childSnapshot => {
                const notification = childSnapshot.val();
                notification.id = childSnapshot.key;

                // Only include notifications for admin
                if (notification.forAdmin) {
                    notifications.push(notification);
                }
            });

            // Sort by creation time (newest first)
            notifications.sort((a, b) => b.createdAt - a.createdAt);

            // Update notification badge
            updateNotificationBadge(notifications.filter(n => !n.read).length);

            // Display notifications if the dropdown is open
            if (document.querySelector('.notifications-dropdown.show')) {
                displayAdminNotifications(notifications);
            }
        } else {
            updateNotificationBadge(0);
        }
    });
}

// Update notification badge
function updateNotificationBadge(count) {
    const badge = document.getElementById('notification-badge');

    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Display admin notifications in dropdown
function displayAdminNotifications(notifications) {
    const container = document.getElementById('notifications-list');

    if (!container) return;

    // Clear container
    container.innerHTML = '';

    if (notifications.length > 0) {
        notifications.forEach(notification => {
            const notificationItem = document.createElement('div');
            notificationItem.className = `notification-item ${notification.read ? 'read' : 'unread'}`;

            // Format date
            const date = new Date(notification.createdAt);
            const dateString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

            notificationItem.innerHTML = `
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${dateString}</div>
                </div>
                <div class="notification-actions">
                    <button class="mark-read-btn" data-id="${notification.id}">
                        ${notification.read ? 'Mark Unread' : 'Mark Read'}
                    </button>
                </div>
            `;

            // Add event listener for mark read/unread button
            const markReadBtn = notificationItem.querySelector('.mark-read-btn');
            markReadBtn.addEventListener('click', () => {
                toggleNotificationReadStatus(notification.id, !notification.read);
            });

            container.appendChild(notificationItem);
        });
    } else {
        container.innerHTML = '<div class="no-notifications">No notifications</div>';
    }
}

// Toggle notification read status
function toggleNotificationReadStatus(notificationId, read) {
    if (!initializeFirebase()) return;

    const database = firebase.database();
    const notificationRef = database.ref(`centralNotifications/${notificationId}`);

    notificationRef.update({ read: read })
        .then(() => {
            console.log(`Notification ${notificationId} marked as ${read ? 'read' : 'unread'}`);
        })
        .catch(error => {
            console.error('Error updating notification status:', error);
        });
}

// Initialize notification system
function initAdminNotifications() {
    if (!initializeFirebase()) return;

    // Add notification bell to header actions
    const headerActions = document.querySelector('.header-actions');

    if (headerActions) {
        const notificationBell = document.createElement('div');
        notificationBell.className = 'notification-bell';
        notificationBell.innerHTML = `
            <i class="notification-icon">🔔</i>
            <span id="notification-badge" class="notification-badge" style="display: none;">0</span>
            <div class="notifications-dropdown">
                <div class="notifications-header">
                    <h3>Notifications</h3>
                    <button id="mark-all-read">Mark All Read</button>
                </div>
                <div id="notifications-list" class="notifications-list">
                    <!-- Notifications will be populated here -->
                </div>
            </div>
        `;

        headerActions.appendChild(notificationBell);

        // Add event listener for notification bell
        notificationBell.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.querySelector('.notifications-dropdown');
            dropdown.classList.toggle('show');

            if (dropdown.classList.contains('show')) {
                // Get latest notifications
                getAdminNotifications();
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.notification-bell')) {
                const dropdown = document.querySelector('.notifications-dropdown');
                if (dropdown) {
                    dropdown.classList.remove('show');
                }
            }
        });

        // Mark all as read button
        const markAllReadBtn = document.getElementById('mark-all-read');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', markAllNotificationsAsRead);
        }
    }

    // Start listening for notifications
    getAdminNotifications();
}

// Mark all notifications as read
function markAllNotificationsAsRead() {
    if (!initializeFirebase()) return;

    const database = firebase.database();
    const centralNotificationsRef = database.ref('centralNotifications');

    centralNotificationsRef.orderByChild('read').equalTo(false).once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                const updates = {};

                snapshot.forEach(childSnapshot => {
                    updates[`${childSnapshot.key}/read`] = true;
                });

                centralNotificationsRef.update(updates)
                    .then(() => {
                        console.log('All notifications marked as read');
                    })
                    .catch(error => {
                        console.error('Error marking all notifications as read:', error);
                    });
            }
        })
        .catch(error => {
            console.error('Error getting unread notifications:', error);
        });
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing admin notifications system...');
    initAdminNotifications();
});
