import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/Offline.css';

const Offline = () => {
  // Check if we're back online
  useEffect(() => {
    const handleOnline = () => {
      window.location.href = '/';
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <div className="offline-page">
      <div className="offline-container">
        <div className="offline-icon">
          <i className='bx bx-wifi-off'></i>
        </div>
        
        <h1>You're Offline</h1>
        
        <p className="offline-message">
          It seems you've lost your internet connection. 
          Some features may not be available until you're back online.
        </p>
        
        <div className="cached-content">
          <h2 className="cached-title">Available Offline:</h2>
          <div className="cached-links">
            <Link to="/" className="cached-link">
              <i className='bx bx-home'></i> Home
            </Link>
            <Link to="/products" className="cached-link">
              <i className='bx bx-food-menu'></i> Menu
            </Link>
            <Link to="/profile" className="cached-link">
              <i className='bx bx-user'></i> Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offline;
