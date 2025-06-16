// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('authToken') || null);
  const [isInitializing, setIsInitializing] = useState(true); // <-- ÉTAT AJOUTÉ

  useEffect(() => {
    try {
      if (token) {
        const decodedUser = jwtDecode(token);
        setUser({ id: decodedUser.id, role: decodedUser.role });
      }
    } catch (error) {
      // Token invalide, on nettoie
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
    } finally {
      // Dans tous les cas, l'initialisation est terminée
      setIsInitializing(false); // <-- ON MET À JOUR L'ÉTAT
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/users/login', { email, password });
      const receivedToken = response.data.token;
      
      localStorage.setItem('authToken', receivedToken);
      const decodedUser = jwtDecode(receivedToken);
      const userPayload = { id: decodedUser.id, role: decodedUser.role };

      // On met à jour les états
      setToken(receivedToken);
      setUser(userPayload);
      
      // CHANGEMENT CLÉ : On retourne les infos de l'utilisateur pour une redirection immédiate
      return { success: true, user: userPayload };
    } catch (error) {
      logout();
      return { success: false, user: null }; // On retourne un échec
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const value = { user, token, isInitializing, login, logout, isAuthenticated: !!token };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}