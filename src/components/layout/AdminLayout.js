import React from 'react';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import '../../styles/components/AdminLayout.css';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <AdminHeader />
      <main className="admin-main">
        {children}
      </main>
      <AdminFooter />
    </div>
  );
};

export default AdminLayout;
