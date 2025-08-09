import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="protected-route-loading-container">
        <div className="protected-route-loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const normalize = (value) => (value || '').toString().toUpperCase().trim();
  const userRole = normalize(user.role);
  const allowed = (allowedRoles || []).map(normalize);

  const getDashboardPath = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return '/super-admin/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      case 'EMPLOYEE':
        return '/employee/dashboard';
      case 'FARMER':
      default:
        return '/dashboard';
    }
  };

  if (allowed.length && !allowed.includes(userRole)) {
    return <Navigate to={getDashboardPath(userRole)} replace />;
  }

  return children;
};

export default ProtectedRoute; 