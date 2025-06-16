// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  // Si l'utilisateur est authentifié, on affiche le contenu de la page demandée (grâce à <Outlet />)
  // Sinon, on le redirige de force vers la page de connexion
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;