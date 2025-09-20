import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // If no token is found, redirect the user to the sign-in page
    return <Navigate to="/signin" replace />;
  }

  // If a token is found, render the child component (the protected page)
  return children;
};

export default ProtectedRoute;