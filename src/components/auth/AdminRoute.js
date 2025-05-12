import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin, isAdminSession } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [checkingClaims, setCheckingClaims] = useState(true);
  const [hasAdminClaim, setHasAdminClaim] = useState(false);

  // First check for admin custom claims and email domain
  useEffect(() => {
    async function checkAdminClaims() {
      if (currentUser) {
        try {
          // Check if email ends with @yogee.com
          if (currentUser.email.endsWith('@yogee.com')) {
            console.log('AdminRoute: User has admin email domain');
            setHasAdminClaim(true);
            setCheckingClaims(false);
            return;
          }

          // Force token refresh to get the latest claims
          await currentUser.getIdToken(true);

          // Get the token result to check claims
          const idTokenResult = await currentUser.getIdTokenResult();

          // Check if the 'admin' claim is true
          if (idTokenResult.claims.admin === true) {
            console.log('AdminRoute: User has admin claim');
            setHasAdminClaim(true);
          } else {
            console.log('AdminRoute: User does not have admin claim');
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

  // Then check database as fallback
  useEffect(() => {
    async function checkAdminStatus() {
      if (currentUser) {
        const adminStatus = await isAdmin(currentUser.uid);
        setIsAdminUser(adminStatus);
      } else {
        setIsAdminUser(false);
      }
      setLoading(false);
    }

    if (!checkingClaims) {
      checkAdminStatus();
    }
  }, [currentUser, isAdmin, checkingClaims]);

  if (loading || checkingClaims) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    console.log('AdminRoute: No user logged in, redirecting to admin login');
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin-login" />;
  }

  // Check admin status from multiple sources
  // 1. Custom claims (primary)
  // 2. Database role check (fallback)
  // 3. Admin session flag (context state)
  if (!hasAdminClaim && !isAdminUser && !isAdminSession) {
    console.log('AdminRoute: User is not an admin, redirecting to admin login');
    // Redirect to admin login if authenticated but not an admin
    return <Navigate to="/admin-login" />;
  }

  console.log('AdminRoute: User is an admin, rendering admin content');
  return children;
};

export default AdminRoute;
