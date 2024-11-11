import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  // Render children if authenticated; otherwise, navigate to /login
  return userInfo ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
