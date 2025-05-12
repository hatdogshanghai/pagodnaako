import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AuthDebug = () => {
  const { currentUser, userDetails } = useAuth();

  const handleTestAuth = async () => {
    try {
      console.log('Current User:', currentUser);
      console.log('User Details:', userDetails);

      // Check if Firebase is initialized
      if (window.firebase) {
        console.log('Firebase is available globally');
      } else {
        console.log('Firebase is not available globally');
      }

      // Check localStorage for any auth tokens
      const localStorageKeys = Object.keys(localStorage);
      const firebaseKeys = localStorageKeys.filter(key => key.includes('firebase'));
      console.log('Firebase localStorage keys:', firebaseKeys);

    } catch (error) {
      console.error('Auth Debug Error:', error);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      background: '#f0f0f0',
      padding: '10px',
      borderRadius: '5px',
      zIndex: 1000,
      maxWidth: '300px',
      display: 'none' /* Always hidden */
    }}>
      <h4>Auth Debug</h4>
      <button onClick={handleTestAuth}>Test Auth</button>
      <div style={{ marginTop: '10px', fontSize: '12px' }}>
        <div><strong>User:</strong> {currentUser ? 'Logged In' : 'Not Logged In'}</div>
        {currentUser && (
          <>
            <div><strong>Email:</strong> {currentUser.email}</div>
            <div><strong>UID:</strong> {currentUser.uid}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthDebug;
