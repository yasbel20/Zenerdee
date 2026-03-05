import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function UserProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    // Redirect to home instead of /login to avoid showing an empty pedidos page
    return <Navigate to="/" replace />;
  }
  return children;
}

export default UserProtectedRoute;
