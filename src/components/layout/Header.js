import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import SearchBar from '../search/SearchBar';
import Cart from '../cart/Cart';
import UserWelcome from './UserWelcome';
import '../../styles/components/Header.css';
import '../../styles/components/HeaderFix.css';

const Header = () => {
  const { currentUser, userDetails, logout, isAdmin } = useAuth();
  const { getCartCount, toggleCart } = useCart();
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  // Check if user is admin and update when userDetails change
  useEffect(() => {
    async function checkAdminStatus() {
      if (currentUser) {
        const adminStatus = await isAdmin(currentUser.uid);
        setIsAdminUser(adminStatus);
      } else {
        setIsAdminUser(false);
      }
    }

    checkAdminStatus();
  }, [currentUser, isAdmin, userDetails]); // Added userDetails dependency to re-render when profile changes

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Toggle profile menu
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <header>
      <div className="nav container">
        <div className="navbar">
          <Link to="/">
            <img src="/images/yogee.png" alt="Yogee Logo" className="yogee" />
          </Link>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/#items" className="nav-link">Featured Items</Link>
          <Link to="/#menu-container" className="nav-link">Menu</Link>
          <Link to="/testimonials" className="nav-link">Testimonials</Link>
          <Link to="/install-guide" className="nav-link">Install App</Link>
        </div>

        <div className="right-section">
          <div className="search-container">
            <SearchBar />
          </div>

          <div className="nav-icons" style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
            {currentUser ? (
              <UserWelcome
                key={userDetails?.profileImage || 'no-image'} // Add key to force re-render when profile image changes
                userDetails={userDetails}
                currentUser={currentUser}
                isAdminUser={isAdminUser}
                showProfileMenu={showProfileMenu}
                toggleProfileMenu={toggleProfileMenu}
                handleLogout={handleLogout}
              />
            ) : (
              <div className="auth-buttons" style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
                <Link to="/login" className="login" style={{ display: 'inline-block', verticalAlign: 'middle' }}>Login</Link>
                <Link to="/register" className="register" style={{ display: 'inline-block', verticalAlign: 'middle' }}>Register</Link>
              </div>
            )}

            <div className="cart-icon" onClick={toggleCart} style={{ display: 'inline-flex', alignItems: 'center', height: '40px', verticalAlign: 'middle' }}>
              <i className='bx bx-shopping-bag' style={{ display: 'flex', alignItems: 'center' }}></i>
              <span className="cart-count">{getCartCount()}</span>
            </div>
          </div>
        </div>
      </div>

      <Cart />
    </header>
  );
};

export default Header;
