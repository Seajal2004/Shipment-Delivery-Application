import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';

const AdminRoute = ({ children }) => {
  const { isAdmin } = useAdmin();
  
  return isAdmin ? children : <Navigate to="/dashboard" />;
};

export default AdminRoute;