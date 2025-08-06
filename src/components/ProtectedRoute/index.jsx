// components/ProtectedRoute/index.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Simply check if token exists - don't verify it here
  const token = localStorage.getItem('token');
  
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;