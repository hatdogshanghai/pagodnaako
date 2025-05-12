import React from 'react';
import '../../styles/components/AdminFooter.css';

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="admin-footer">
      <div className="container">
        <div className="admin-footer-content">
          <div className="admin-footer-copyright">
            <p>&copy; {currentYear} Yogee's Admin Panel. All rights reserved.</p>
          </div>
          <div className="admin-footer-links">
            <a href="/" target="_blank" rel="noopener noreferrer">View Site</a>
            <span className="admin-footer-divider">|</span>
            <a href="/admin-dashboard">Dashboard</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
