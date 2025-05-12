import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import AdminLayout from '../components/layout/AdminLayout';
import { auth, database } from '../services/firebase';
import '../styles/pages/Auth.css';
import '../styles/pages/AdminAuth.css';

const AdminRegister = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email domain for admin
    if (!email.endsWith('@yogee.com')) {
      return setError('Admin registration is restricted to @yogee.com email addresses only.');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with username
      await updateProfile(user, {
        displayName: username
      });

      // Save user to database with admin role
      await set(ref(database, `users/${user.uid}`), {
        email: email,
        username: username,
        role: 'admin',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });

      // Redirect to admin dashboard
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Admin registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('Email is already in use. Please use a different email or login.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password.');
      } else {
        setError('Failed to create an admin account. Please try again.');
      }
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
              <h1 className="auth-title">Admin Registration</h1>

              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <small>Only @yogee.com email addresses are allowed for admin registration.</small>
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

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="auth-btn"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register as Admin'}
                </button>
              </form>

              <div className="auth-links">
                <p>
                  Already have an admin account? <Link to="/admin-login">Login as Admin</Link>
                </p>
                <p>
                  <Link to="/register">Back to User Registration</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRegister;
