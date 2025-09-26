import React from 'react';
import { useSelector } from 'react-redux';
import { selectUserAuth } from '../store/authSlice.js';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectUserAuth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;