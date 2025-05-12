
// Global Notifications System
// This file handles notifications for all pages (home, products, profile)

// Store the last notification count to detect new notifications
let lastNotificationCount = 0;

// Function to show desktop notification
function showDesktopNotification(title, message) {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notifications");
        return;
    }

    // Check if permission is already granted
    if (Notification.permission === "granted") {
        createNotification(title, message);
    }
    // Otherwise, request permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            // If the user accepts, create a notification
            if (permission === "granted") {
                createNotification(title, message);
            }
        });
    }

    // Function to create the notification
    function createNotification(title, message) {
        const notification = new Notification(title, {
            body: message,
            icon: 'yogee.png'
        });

        // Close the notification after 5 seconds
        setTimeout(() => {
            notification.close();
        }, 5000);

        // Navigate to profile page when notification is clicked
        notification.onclick = function() {
            window.focus();
            window.location.href = 'profile.html';
        };
    }
}

// Function to animate the notification bell
function animateNotificationBell(bellElement) {
    // Add animation class
    bellElement.classList.add('notification-bell-animate');

    // Remove animation class after animation completes
    setTimeout(() => {
        bellElement.classList.remove('notification-bell-animate');
    }, 1000);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase if not already initialized
    if (typeof firebase === 'undefined') {
        console.error('Firebase is not initialized. Notifications will not work.');
        return;
    }

    // Get notification elements
    const notificationBell = document.getElementById('notification-bell');
    const notificationCount = document.getElementById('notification-count');
    const notificationDropdown = document.getElementById('notification-dropdown');
    const notificationList = document.getElementById('notification-list');
    const markAllReadBtn = document.getElementById('mark-all-read');

    // Check if notification elements exist
    if (!notificationBell || !notificationCount || !notificationDropdown || !notificationList || !markAllReadBtn) {
        console.error('Notification elements not found. Notifications will not work.');
        return;
    }

    // Setup notification bell click handler
    notificationBell.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationDropdown.style.display = notificationDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!notificationBell.contains(e.target)) {
            notificationDropdown.style.display = 'none';
        }
    });

    // Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in, load notifications
            loadUserNotifications(user.uid);

            // Mark all notifications as read
            markAllReadBtn.addEventListener('click', function() {
                markAllNotificationsAsRead(user.uid);
            });
        } else {
            // User is not signed in, hide notification count
            notificationCount.style.display = 'none';
        }
    });

    // Load user notifications
    async function loadUserNotifications(userId) {
        try {
            // Get reference to user's notifications
            const userNotificationsRef = firebase.database().ref(`users/${userId}/notifications`);

            // Listen for notifications in real-time
            userNotificationsRef.on('value', (snapshot) => {
                const notifications = [];
                let unreadCount = 0;

                // Clear existing notifications
                notificationList.innerHTML = '';

                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        const notification = {
                            id: childSnapshot.key,
                            ...childSnapshot.val()
                        };

                        notifications.push(notification);

                        // Count unread notifications
                        if (!notification.read) {
                            unreadCount++;
                        }
                    });

                    // Sort by creation time (newest first)
                    notifications.sort((a, b) => b.createdAt - a.createdAt);

                    // Update notification count
                    notificationCount.textContent = unreadCount;
                    notificationCount.style.display = unreadCount > 0 ? 'flex' : 'none';

                    // Check if there are new notifications
                    if (unreadCount > lastNotificationCount) {
                        // Play notification sound
                        if (window.playNotificationSound) {
                            window.playNotificationSound();
                        }

                        // Animate notification bell
                        animateNotificationBell(notificationBell);

                        // Show desktop notification for the newest unread notification
                        if (notifications.length > 0) {
                            const newestNotification = notifications.find(n => !n.read);
                            if (newestNotification) {
                                let title = 'New Notification';
                                if (newestNotification.type === 'order_accepted') {
                                    title = 'Order Accepted';
                                } else if (newestNotification.type === 'order_rejected') {
                                    title = 'Order Rejected';
                                } else if (newestNotification.type === 'order_shipped') {
                                    title = 'Order Shipped';
                                } else if (newestNotification.type === 'order_delivered') {
                                    title = 'Order Delivered';
                                } else if (newestNotification.type === 'order_cancelled') {
                                    title = 'Order Cancelled';
                                }

                                showDesktopNotification(title, newestNotification.message);
                            }
                        }
                    }

                    // Update last notification count
                    lastNotificationCount = unreadCount;

                    // Display notifications
                    if (notifications.length > 0) {
                        notifications.forEach(notification => {
                            const notificationItem = document.createElement('div');
                            notificationItem.className = `notification-item${notification.read ? '' : ' unread'}`;
                            notificationItem.dataset.id = notification.id;

                            // Format time
                            const notificationTime = new Date(notification.createdAt);
                            const timeString = notificationTime.toLocaleDateString() + ' ' +
                                              notificationTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

                            // Get title based on notification type
                            let title = 'Notification';
                            if (notification.type === 'order_accepted') {
                                title = 'Order Accepted';
                            } else if (notification.type === 'order_rejected') {
                                title = 'Order Rejected';
                            } else if (notification.type === 'order_shipped') {
                                title = 'Order Shipped';
                            } else if (notification.type === 'order_delivered') {
                                title = 'Order Delivered';
                            } else if (notification.type === 'order_cancelled') {
                                title = 'Order Cancelled';
                            }

                            notificationItem.innerHTML = `
                                <div class="notification-title">${title}</div>
                                <div class="notification-message">${notification.message}</div>
                                <div class="notification-time">${timeString}</div>
                            `;

                            // Mark as read when clicked
                            notificationItem.addEventListener('click', () => {
                                if (!notification.read) {
                                    markNotificationAsRead(userId, notification.id);
                                }

                                // If it's an order notification and we're on the profile page, navigate to the order
                                if (notification.orderId && window.location.pathname.includes('profile.html')) {
                                    // Scroll to the order in the order history
                                    const orderElement = document.querySelector(`[data-order-id="${notification.orderId}"]`);
                                    if (orderElement) {
                                        orderElement.scrollIntoView({ behavior: 'smooth' });
                                        // Highlight the order briefly
                                        orderElement.closest('.order-item').style.backgroundColor = '#f0f7ff';
                                        setTimeout(() => {
                                            orderElement.closest('.order-item').style.backgroundColor = '';
                                        }, 2000);
                                    }
                                } else if (notification.orderId && !window.location.pathname.includes('profile.html')) {
                                    // If we're not on the profile page, redirect to the profile page
                                    window.location.href = 'profile.html';
                                }
                            });

                            notificationList.appendChild(notificationItem);
                        });
                    } else {
                        notificationList.innerHTML = '<div class="no-notifications">No notifications</div>';
                    }
                } else {
                    notificationList.innerHTML = '<div class="no-notifications">No notifications</div>';
                    notificationCount.style.display = 'none';
                }
            });
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }

    // Mark notification as read
    async function markNotificationAsRead(userId, notificationId) {
        try {
            const notificationRef = firebase.database().ref(`users/${userId}/notifications/${notificationId}`);
            await notificationRef.update({ read: true });

            // Update UI
            const notificationItem = document.querySelector(`.notification-item[data-id="${notificationId}"]`);
            if (notificationItem) {
                notificationItem.classList.remove('unread');
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }

    // Mark all notifications as read
    async function markAllNotificationsAsRead(userId) {
        try {
            const userNotificationsRef = firebase.database().ref(`users/${userId}/notifications`);
            const snapshot = await userNotificationsRef.once('value');

            if (snapshot.exists()) {
                const updates = {};

                snapshot.forEach(childSnapshot => {
                    const notification = childSnapshot.val();
                    if (!notification.read) {
                        updates[`${childSnapshot.key}/read`] = true;
                    }
                });

                if (Object.keys(updates).length > 0) {
                    await userNotificationsRef.update(updates);
                }

                // Update UI
                document.querySelectorAll('.notification-item.unread').forEach(item => {
                    item.classList.remove('unread');
                });

                // Update count
                notificationCount.textContent = '0';
                notificationCount.style.display = 'none';
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    }
});
