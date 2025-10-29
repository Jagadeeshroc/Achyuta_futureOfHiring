

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
