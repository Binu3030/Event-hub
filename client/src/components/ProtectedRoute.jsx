// client/src/components/ProtectedRoute.jsx
'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  // Convert array to string for a stable useEffect dependency comparison
  const rolesString = JSON.stringify(allowedRoles);

  useEffect(() => {
    if (!loading) {
      // 1. Not logged in -> Redirect to Login
      if (!user) {
        router.replace('/login');
        return;
      }

      // 2. Role restriction check
      const roles = JSON.parse(rolesString);
      if (roles.length > 0 && !roles.includes(user?.role)) {
        router.replace('/dashboard');
      }
    }
  }, [user, loading, rolesString, router]);

  // Block rendering if loading, not logged in, OR if user lacks required role
  const isAuthorized = user && (allowedRoles.length === 0 || allowedRoles.includes(user.role));

  if (loading || !isAuthorized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: '500' }}>Verifying permissions...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;