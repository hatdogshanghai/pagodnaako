import React from 'react';
import { Link } from 'react-router-dom';
import './UserWelcome.css';

const UserWelcome = ({
  userDetails,
  currentUser,
  isAdminUser,
  showProfileMenu,
  toggleProfileMenu,
  handleLogout
}) => {
  return (
    <div className="user-welcome-container">
      <div className="user-welcome-text">
        Welcome, {userDetails?.username || currentUser.displayName || 'User'}
      </div>
      <div className="user-welcome-icon" onClick={toggleProfileMenu}>
        {userDetails?.profileImage ? (
          <img
            key={userDetails.profileImage} // Add key to force re-render when image changes
            src={userDetails.profileImage + '?t=' + new Date().getTime()} // Add timestamp to prevent caching
            alt="Profile"
            className="user-welcome-image"
          />
        ) : (
          <i className='bx bx-user'></i>
        )}

        {showProfileMenu && (
          <div className="user-welcome-menu">
            <Link to="/profile">Profile</Link>
            {isAdminUser && (
              <Link to="/admin-dashboard">Admin Dashboard</Link>
            )}
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserWelcome;
