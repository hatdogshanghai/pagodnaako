import React, { useState, useEffect } from 'react';
import { ref, get, update, remove } from 'firebase/database';
import AdminLayout from '../components/layout/AdminLayout';
import { useAuth } from '../contexts/AuthContext';
import { database } from '../services/firebase';
import '../styles/pages/AdminDashboard.css';

const AdminDashboard = () => {
  const { currentUser, userDetails } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Load data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch orders
        const ordersRef = ref(database, 'centralOrders');
        const ordersSnapshot = await get(ordersRef);

        if (ordersSnapshot.exists()) {
          const ordersData = ordersSnapshot.val();
          const ordersArray = Object.keys(ordersData).map(key => ({
            id: key,
            ...ordersData[key]
          }));

          // Sort orders by date (newest first)
          ordersArray.sort((a, b) => new Date(b.date) - new Date(a.date));

          setOrders(ordersArray);
        } else {
          setOrders([]);
        }

        // Fetch users
        const usersRef = ref(database, 'users');
        const usersSnapshot = await get(usersRef);

        if (usersSnapshot.exists()) {
          const usersData = usersSnapshot.val();
          const usersArray = Object.keys(usersData).map(key => ({
            id: key,
            ...usersData[key]
          }));

          setUsers(usersArray);
        } else {
          setUsers([]);
        }

        // Fetch feedbacks
        const feedbacksRef = ref(database, 'feedbacks');
        const feedbacksSnapshot = await get(feedbacksRef);

        if (feedbacksSnapshot.exists()) {
          const feedbacksData = feedbacksSnapshot.val();
          const feedbacksArray = Object.keys(feedbacksData).map(key => ({
            id: key,
            ...feedbacksData[key]
          }));

          // Sort feedbacks by date (newest first)
          feedbacksArray.sort((a, b) => new Date(b.date) - new Date(a.date));

          setFeedbacks(feedbacksArray);
        } else {
          setFeedbacks([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage({
          text: 'Error loading data. Please refresh the page.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update order status
  const updateOrderStatus = async (orderId, userId, newStatus) => {
    try {
      setMessage({ text: 'Updating order status...', type: 'info' });

      // Update in central orders
      await update(ref(database, `centralOrders/${orderId}`), {
        status: newStatus
      });

      // Update in user's orders
      await update(ref(database, `users/${userId}/orders/${orderId}`), {
        status: newStatus
      });

      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      setMessage({
        text: `Order status updated to ${newStatus}`,
        type: 'success'
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating order status:', error);
      setMessage({
        text: 'Error updating order status. Please try again.',
        type: 'error'
      });
    }
  };

  // Delete order
  const deleteOrder = async (orderId, userId) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      setMessage({ text: 'Deleting order...', type: 'info' });

      // Delete from central orders
      await remove(ref(database, `centralOrders/${orderId}`));

      // Delete from user's orders
      await remove(ref(database, `users/${userId}/orders/${orderId}`));

      // Update local state
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));

      setMessage({
        text: 'Order deleted successfully',
        type: 'success'
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error deleting order:', error);
      setMessage({
        text: 'Error deleting order. Please try again.',
        type: 'error'
      });
    }
  };

  // Delete feedback
  const deleteFeedback = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      return;
    }

    try {
      setMessage({ text: 'Deleting feedback...', type: 'info' });

      // Delete from feedbacks
      await remove(ref(database, `feedbacks/${feedbackId}`));

      // Update local state
      setFeedbacks(prevFeedbacks => prevFeedbacks.filter(feedback => feedback.id !== feedbackId));

      setMessage({
        text: 'Feedback deleted successfully',
        type: 'success'
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error deleting feedback:', error);
      setMessage({
        text: 'Error deleting feedback. Please try again.',
        type: 'error'
      });
    }
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="container">
          <h1 className="page-title">Admin Dashboard</h1>

          <div className="admin-info">
            <p>
              Logged in as: <strong>{userDetails?.username || currentUser?.displayName}</strong> |
              Role: <strong>Admin</strong> |
              Email: <strong>{currentUser?.email}</strong>
            </p>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="dashboard-tabs">
            <button
              className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
            <button
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button
              className={`tab-btn ${activeTab === 'feedbacks' ? 'active' : ''}`}
              onClick={() => setActiveTab('feedbacks')}
            >
              Feedbacks
            </button>
          </div>

          <div className="dashboard-content">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="orders-tab">
                <h2>Manage Orders</h2>

                {loading ? (
                  <div className="loading">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="no-data">
                    <p>No orders found.</p>
                  </div>
                ) : (
                  <div className="orders-table-container">
                    <table className="orders-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Date</th>
                          <th>Total</th>
                          <th>Payment Method</th>
                          <th>Payment Status</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>
                              <div>{order.customerName}</div>
                              <div className="small-text">{order.email}</div>
                            </td>
                            <td>{new Date(order.date).toLocaleString()}</td>
                            <td>₱{order.total.toFixed(2)}</td>
                            <td>
                              {order.paymentMethod === 'cash' ? (
                                <span className="payment-method-badge cash">Cash on Delivery</span>
                              ) : order.paymentMethod === 'gcash' ? (
                                <span className="payment-method-badge gcash">GCash</span>
                              ) : order.paymentMethod === 'paymongo' ? (
                                <span className="payment-method-badge online">Online Payment</span>
                              ) : (
                                <span className="payment-method-badge">Unknown</span>
                              )}
                            </td>
                            <td>
                              {order.paymentMethod === 'cash' ? (
                                <span className="payment-status-badge">N/A</span>
                              ) : order.paymentStatus === 'paid' ? (
                                <span className="payment-status-badge paid">Paid</span>
                              ) : (
                                <span className="payment-status-badge pending">Pending</span>
                              )}
                            </td>
                            <td>
                              <span className={`status-badge ${order.status.toLowerCase()}`}>
                                {order.status}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <select
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.id, order.userId, e.target.value)}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Accepted">Accepted</option>
                                  <option value="Preparing">Preparing</option>
                                  <option value="Ready">Ready for Pickup</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                                <button
                                  className="delete-btn"
                                  onClick={() => deleteOrder(order.id, order.userId)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="users-tab">
                <h2>Manage Users</h2>

                {loading ? (
                  <div className="loading">Loading users...</div>
                ) : users.length === 0 ? (
                  <div className="no-data">
                    <p>No users found.</p>
                  </div>
                ) : (
                  <div className="users-table-container">
                    <table className="users-table">
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Member Since</th>
                          <th>Last Login</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                              <span className={`role-badge ${user.role}`}>
                                {user.role}
                              </span>
                            </td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Feedbacks Tab */}
            {activeTab === 'feedbacks' && (
              <div className="feedbacks-tab">
                <h2>Manage Feedbacks</h2>

                {loading ? (
                  <div className="loading">Loading feedbacks...</div>
                ) : feedbacks.length === 0 ? (
                  <div className="no-data">
                    <p>No feedbacks found.</p>
                  </div>
                ) : (
                  <div className="feedbacks-list">
                    {feedbacks.map((feedback) => (
                      <div className="feedback-card" key={feedback.id}>
                        <div className="feedback-header">
                          <div className="user-info">
                            {feedback.profileImage ? (
                              <img
                                src={feedback.profileImage}
                                alt={feedback.username}
                                className="user-image"
                              />
                            ) : (
                              <div className="user-placeholder">
                                <i className='bx bx-user'></i>
                              </div>
                            )}
                            <div>
                              <h3>{feedback.username}</h3>
                              <div className="feedback-date">
                                {new Date(feedback.date).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="feedback-rating">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`bx ${i < feedback.rating ? 'bxs-star' : 'bx-star'}`}
                              ></i>
                            ))}
                          </div>
                        </div>
                        <p className="feedback-text">{feedback.text}</p>
                        <div className="feedback-actions">
                          <button
                            className="delete-btn"
                            onClick={() => deleteFeedback(feedback.id)}
                          >
                            Delete Feedback
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;