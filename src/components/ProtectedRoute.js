import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UIContext } from '../context/UIContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredRole }) {
  const { isLoggedIn, user } = useContext(AuthContext);
  const { openAuthModal } = useContext(UIContext);

  useEffect(() => {
    if (!isLoggedIn) {
      openAuthModal();
    }
  }, [isLoggedIn, openAuthModal]);

  if (!isLoggedIn) {
    return null; // Don't render children if not logged in
  }

  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === 'user' && user?.role === 'visitor') {
    return <Navigate to="/" replace />;
  }

  return children;
}