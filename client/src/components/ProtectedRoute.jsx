import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  // While checking the authentication state, show a clean loading indicator
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <h3>Loading session...</h3>
      </div>
    );
  }

  // Rule 1: If not logged in, redirect straight to the login portal
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Rule 2: If roles are specified, ensure the current user's role is authorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem' }}>
        <h2 style={{ color: '#ef4444' }}>⛔ Access Denied</h2>
        <p style={{ color: '#64748b' }}>You do not possess the required permissions to view this administrative resource.</p>
      </div>
    );
  }

  // If all checks pass, render the target child component safely
  return children;
};

export default ProtectedRoute;