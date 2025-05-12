import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { ToastProvider } from './contexts/ToastContext';
import { CartProvider } from './contexts/CartContext';
import { OrderStatusProvider } from './contexts/OrderStatusContext';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminRoute from './components/auth/AdminRoute';

function AdminApp() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <ToastProvider>
            <CartProvider>
              <OrderStatusProvider>
                <Routes>
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/admin-register" element={<AdminRegister />} />
                  <Route
                    path="/admin-dashboard"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/admin-login" replace />} />
                </Routes>
              </OrderStatusProvider>
            </CartProvider>
          </ToastProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default AdminApp;
