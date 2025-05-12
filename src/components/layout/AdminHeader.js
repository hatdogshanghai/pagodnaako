import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/components/AdminHeader.css';

const AdminHeader = () => {
  const { currentUser, userDetails, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin-login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="admin-header">
      <div className="container">
        <div className="admin-header-content">
          <div className="admin-logo">
            <Link to="/admin-dashboard">
              <h1>Yogee's Admin</h1>
            </Link>
          </div>

          <nav className="admin-nav">
            <ul className="admin-nav-list">
              <li className="admin-nav-item">
                <Link to="/admin-dashboard" className="admin-nav-link">Dashboard</Link>
              </li>
              <li className="admin-nav-item">
                <a href="/" className="admin-nav-link" target="_blank" rel="noopener noreferrer">View Site</a>
              </li>
            </ul>
          </nav>

          <div className="admin-user-menu">
            {currentUser ? (
              <div className="admin-user-info">
                <div className="admin-user-avatar">
                  {userDetails?.profileImage ? (
                    <img src={userDetails.profileImage} alt="Profile" />
                  ) : (
                    <div className="admin-avatar-placeholder">
                      <i className='bx bx-user'></i>
                    </div>
                  )}
                </div>
                <div className="admin-user-details">
                  <span className="admin-username">{userDetails?.username || currentUser.displayName}</span>
                  <span className="admin-role">Administrator</span>
                </div>
                <button className="admin-logout-btn" onClick={handleLogout}>
                  <i className='bx bx-log-out'></i>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="admin-auth-links">
                <Link to="/admin-login" className="admin-login-link">Login</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
