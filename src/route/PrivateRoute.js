import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const auth = JSON.parse(localStorage.getItem('authenticated'));
  return auth ? children : <Navigate to="/" />;
}

export default PrivateRoute;
