// client/src/components/ProtectedRoute.jsx
'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // 1. Not logged in -> Redirect to Login
      if (!user) {
        router.replace('/login');
        return;
      }

      // 2. Role restriction check (e.g. allowedRoles=['admin', 'organizer'])
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        router.replace('/dashboard'); // Unauthorized roles get sent back to dashboard
      }
    }
  }, [user, loading, allowedRoles, router]);

  if (loading || !user) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Verifying permissions...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;