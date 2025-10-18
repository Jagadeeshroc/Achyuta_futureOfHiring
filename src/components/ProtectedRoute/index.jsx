// components/ProtectedRoute/index.jsx

// import { Navigate, Outlet } from 'react-router-dom';

// const ProtectedRoute = () => {
//   // Simply check if token exists - don't verify it here
//   const token = localStorage.getItem('token');
  
//   return token ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;



import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    // If user is not logged in, redirect to StartPage
    return <Navigate to="/" replace />;
  }

  // If logged in, render nested routes
  return <Outlet />;
};

export default ProtectedRoute;
