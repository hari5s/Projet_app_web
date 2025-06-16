import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ allowedRoles }) {
  // On récupère le nouvel état 'isInitializing'
  const { user, isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  // NOUVELLE LOGIQUE : Si le contexte est en cours d'initialisation, on attend
  if (isInitializing) {
    return <div>Chargement de la session...</div>; // Ou un composant de chargement plus joli
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;