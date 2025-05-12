import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, isAdminSession } = useAuth();
  const [checkingClaims, setCheckingClaims] = useState(true);
  const [hasAdminClaim, setHasAdminClaim] = useState(false);

  // Check for admin custom claims and email domain
  useEffect(() => {
    async function checkAdminClaims() {
      if (currentUser) {
        try {
          // Check if email ends with @yogee.com
          if (currentUser.email.endsWith('@yogee.com')) {
            console.log('ProtectedRoute: User has admin email domain, should use admin routes');
            setHasAdminClaim(true);
            setCheckingClaims(false);
            return;
          }

          // Get the token result to check claims
          const idTokenResult = await currentUser.getIdTokenResult();

          // Check if the 'admin' claim is true
          if (idTokenResult.claims.admin === true) {
            console.log('ProtectedRoute: User has admin claim, should use admin routes');
            setHasAdminClaim(true);
          } else {
            console.log('ProtectedRoute: User does not have admin claim');
            setHasAdminClaim(false);
          }
        } catch (error) {
          console.error('Error checking admin claims:', error);
          setHasAdminClaim(false);
        }
      } else {
        setHasAdminClaim(false);
      }
      setCheckingClaims(false);
    }

    checkAdminClaims();
  }, [currentUser]);

  if (checkingClaims) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    console.log('ProtectedRoute: No user logged in, redirecting to login');
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  // If this is an admin session or user has admin claim, redirect to admin dashboard
  if (isAdminSession || hasAdminClaim) {
    console.log('ProtectedRoute: User is an admin, redirecting to admin dashboard');
    return <Navigate to="/admin-dashboard" />;
  }

  console.log('ProtectedRoute: User is a regular user, rendering protected content');
  return children;
};

export default ProtectedRoute;
