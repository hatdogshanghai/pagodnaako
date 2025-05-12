import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/Auth.css';
import '../styles/pages/AdminAuth.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);

      // Use the adminLogin function from AuthContext
      await adminLogin(email, password);

      // If successful, redirect to admin dashboard
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Admin login error:', error);
      setError(error.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="auth-page admin-auth-page">
        <div className="container">
          <div className="auth-container">
            <div className="auth-form-container">
              <h1 className="auth-title">Admin Login</h1>

              <div className="auth-info" style={{
                backgroundColor: '#e8f4fd',
                padding: '10px 15px',
                borderRadius: '5px',
                marginBottom: '15px',
                fontSize: '0.9rem',
                color: '#0c5460',
                border: '1px solid #bee5eb'
              }}>
                <p style={{ margin: '0' }}>
                  <strong>Note:</strong> Only emails ending with <strong>@yogee.com</strong> can be used for admin access.
                </p>
              </div>

              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="auth-btn"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login as Admin'}
                </button>
              </form>

              <div className="auth-links">
                <p>
                  Need an admin account? <Link to="/admin-register">Register as Admin</Link>
                </p>
                <p>
                  <Link to="/login">Back to User Login</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLogin;