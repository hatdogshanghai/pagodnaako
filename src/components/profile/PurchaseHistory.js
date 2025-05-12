import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrderStatus } from '../../contexts/OrderStatusContext';
import '../../styles/components/PurchaseHistory.css';

const PurchaseHistory = () => {
  const navigate = useNavigate();
  const { orders, loading, counts, getFilteredOrders } = useOrderStatus();

  // State to track which filter is active
  const [activeFilter, setActiveFilter] = useState(() => {
    // Initialize from localStorage if available
    return localStorage.getItem('activeOrderFilter') || null;
  });

  const handleOptionClick = (option) => {
    setActiveFilter(option);

    // Get filtered orders using the context function
    const filteredOrders = getFilteredOrders(option);

    // Store filtered orders in localStorage for use in the orders page
    localStorage.setItem('filteredOrders', JSON.stringify(filteredOrders));
    localStorage.setItem('activeOrderFilter', option);

    // Navigate to the orders page with the filter applied
    navigate('/profile/orders', { state: { filter: option, orders: filteredOrders } });
  };

  if (loading) {
    return <div className="loading">Loading purchase history...</div>;
  }

  return (
    <div className="purchase-history-container">
      <div className="purchase-history-header">
        <div className="purchase-history-title">
          <i className='bx bx-shopping-bag'></i>
          <h3>My Purchases</h3>
        </div>
        <Link to="/profile/orders" className="view-history-link">
          View Purchase History <i className='bx bx-chevron-right'></i>
        </Link>
      </div>

      <div className="purchase-options">
        <div
          className={`purchase-option to-pay ${activeFilter === 'to-pay' ? 'active' : ''}`}
          onClick={() => handleOptionClick('to-pay')}
        >
          <div className="purchase-option-icon">
            <i className='bx bx-receipt'></i>
            {counts.toPay > 0 && (
              <span className="purchase-option-badge">{counts.toPay}</span>
            )}
          </div>
          <div className="purchase-option-label">To Pay</div>
        </div>

        <div
          className={`purchase-option to-ship ${activeFilter === 'to-ship' ? 'active' : ''}`}
          onClick={() => handleOptionClick('to-ship')}
        >
          <div className="purchase-option-icon">
            <i className='bx bx-package'></i>
            {counts.toShip > 0 && (
              <span className="purchase-option-badge">{counts.toShip}</span>
            )}
          </div>
          <div className="purchase-option-label">To Ship</div>
        </div>

        <div
          className={`purchase-option to-receive ${activeFilter === 'to-receive' ? 'active' : ''}`}
          onClick={() => handleOptionClick('to-receive')}
        >
          <div className="purchase-option-icon">
            <i className='bx bx-box'></i>
            {counts.toReceive > 0 && (
              <span className="purchase-option-badge">{counts.toReceive}</span>
            )}
          </div>
          <div className="purchase-option-label">To Receive</div>
        </div>

        <div
          className={`purchase-option to-rate ${activeFilter === 'to-rate' ? 'active' : ''}`}
          onClick={() => handleOptionClick('to-rate')}
        >
          <div className="purchase-option-icon">
            <i className='bx bx-star'></i>
            {counts.toRate > 0 && (
              <span className="purchase-option-badge">{counts.toRate}</span>
            )}
          </div>
          <div className="purchase-option-label">To Rate</div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;
