import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrderStatus } from '../contexts/OrderStatusContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import '../styles/pages/OrdersPage.css';

const OrdersPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, loading, getFilteredOrders } = useOrderStatus();
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Initialize from location state or localStorage
  useEffect(() => {
    const filter = location.state?.filter || localStorage.getItem('activeOrderFilter');
    setActiveFilter(filter);

    if (filter) {
      const filteredOrders = getFilteredOrders(filter);
      setDisplayedOrders(filteredOrders);
    } else {
      setDisplayedOrders(orders);
    }
  }, [location.state, orders, getFilteredOrders]);

  // Toggle order details modal
  const toggleOrderModal = () => {
    setShowOrderModal(!showOrderModal);
    if (showOrderModal) {
      setSelectedOrder(null);
    }
  };

  // Handle view order details
  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    localStorage.setItem('activeOrderFilter', filter);
    
    const filteredOrders = getFilteredOrders(filter);
    setDisplayedOrders(filteredOrders);
    
    // Update URL without reloading the page
    navigate('/profile/orders', { state: { filter, orders: filteredOrders }, replace: true });
  };

  // Get filter name for display
  const getFilterName = (filter) => {
    switch(filter) {
      case 'to-pay': return 'To Pay';
      case 'to-ship': return 'To Ship';
      case 'to-receive': return 'To Receive';
      case 'to-rate': return 'To Rate';
      default: return 'All Orders';
    }
  };

  return (
    <>
      <Header />
      
      <main className="orders-page">
        <div className="container">
          <div className="orders-header">
            <h1 className="page-title">My Orders</h1>
            <div className="filter-tabs">
              <button 
                className={`filter-tab ${activeFilter === null ? 'active' : ''}`}
                onClick={() => handleFilterChange(null)}
              >
                All
              </button>
              <button 
                className={`filter-tab ${activeFilter === 'to-pay' ? 'active' : ''}`}
                onClick={() => handleFilterChange('to-pay')}
              >
                To Pay
              </button>
              <button 
                className={`filter-tab ${activeFilter === 'to-ship' ? 'active' : ''}`}
                onClick={() => handleFilterChange('to-ship')}
              >
                To Ship
              </button>
              <button 
                className={`filter-tab ${activeFilter === 'to-receive' ? 'active' : ''}`}
                onClick={() => handleFilterChange('to-receive')}
              >
                To Receive
              </button>
              <button 
                className={`filter-tab ${activeFilter === 'to-rate' ? 'active' : ''}`}
                onClick={() => handleFilterChange('to-rate')}
              >
                To Rate
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading orders...</div>
          ) : displayedOrders.length === 0 ? (
            <div className="no-orders">
              <i className='bx bx-package'></i>
              <p>No {getFilterName(activeFilter)} orders found.</p>
            </div>
          ) : (
            <div className="orders-grid">
              {displayedOrders.map((order) => (
                <div className="order-card" key={order.id}>
                  <div className="order-header">
                    <div className="order-number">Order #{order.id}</div>
                    <div className={`order-status ${order.status?.toLowerCase()}`}>
                      {order.status || "Pending"}
                    </div>
                  </div>

                  <div className="order-content">
                    {order.items && order.items.length > 0 && (
                      <div className="order-image">
                        {order.items[0].image ? (
                          <img
                            src={order.items[0].image.includes('/') ? order.items[0].image : `/images/${order.items[0].image}`}
                            alt={order.items[0].name}
                          />
                        ) : (
                          <div className="image-placeholder">
                            <i className='bx bx-package'></i>
                          </div>
                        )}
                        {order.items.length > 1 && (
                          <div className="item-count">+{order.items.length - 1}</div>
                        )}
                      </div>
                    )}

                    <div className="order-details">
                      <div className="order-date">
                        <i className='bx bx-calendar'></i> {new Date(order.date).toLocaleDateString()}
                      </div>
                      <div className="order-items">
                        <span>Items: </span>
                        {order.items && order.items.map((item, index) => (
                          <span key={index}>
                            {item.name}{index < order.items.length - 1 ? ', ' : ''}
                          </span>
                        )).slice(0, 2)}
                        {order.items && order.items.length > 2 && <span> and {order.items.length - 2} more</span>}
                      </div>
                      <div className="order-amount">₱{order.total.toFixed(2)}</div>
                      <button
                        className="view-order-btn"
                        onClick={() => handleViewOrderDetails(order)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default OrdersPage;
