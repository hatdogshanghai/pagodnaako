import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Google login error:', error);
      setError('Failed to log in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="auth-page">
        <div className="container">
          <div className="auth-container">
            <div className="auth-form-container">
              <h1 className="auth-title">Login</h1>

              <div className="auth-info" style={{
                backgroundColor: '#f8f9fa',
                padding: '10px 15px',
                borderRadius: '5px',
                marginBottom: '15px',
                fontSize: '0.9rem',
                color: '#495057',
                border: '1px solid #dee2e6'
              }}>
                <p style={{ margin: '0' }}>
                  <strong>Note:</strong> If you have an admin account (@yogee.com email), please use the <a href="/admin-login" style={{ color: '#007bff', textDecoration: 'underline' }}>Admin Login</a> page.
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
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <div className="auth-divider">
                <span>OR</span>
              </div>

              <button
                type="button"
                className="google-btn"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <i className='bx bxl-google'></i>
                Login with Google
              </button>

              <div className="auth-links">
                <p>
                  Don't have an account? <Link to="/register">Register</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Login;
