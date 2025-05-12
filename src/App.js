import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ProductProvider } from './contexts/ProductContext';
import { ToastProvider } from './contexts/ToastContext';
import { OrderStatusProvider } from './contexts/OrderStatusContext';
import Home from './pages/Home';
import Products from './pages/Products';
import ProfileNew from './pages/ProfileNew';
import OrdersPage from './pages/OrdersPage';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import SearchResults from './pages/SearchResults';
import Testimonials from './pages/Testimonials';
import Offline from './pages/Offline';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import InstallGuide from './pages/InstallGuide';

import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import InstallBanner from './components/ui/InstallBanner';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <ToastProvider>
              <OrderStatusProvider>
                <InstallBanner />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/testimonials" element={<Testimonials />} />
                  <Route path="/search-results" element={<SearchResults />} />
                  <Route path="/offline" element={<Offline />} />
                  <Route path="/install-guide" element={<InstallGuide />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/admin-register" element={<AdminRegister />} />

                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfileNew />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile/orders"
                    element={
                      <ProtectedRoute>
                        <OrdersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin-dashboard"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                </Routes>
              </OrderStatusProvider>
            </ToastProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
