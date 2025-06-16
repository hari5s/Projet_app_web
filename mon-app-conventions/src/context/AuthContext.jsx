// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api'; // Notre instance axios pré-configurée

// On crée le Contexte qui va stocker les informations
const AuthContext = createContext(null);

// On crée le "Fournisseur" (Provider) qui va rendre ces informations
// accessibles à toute notre application
export function AuthProvider({ children }) {
  // On utilise des états pour garder en mémoire le token et les infos de l'utilisateur
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);

  // Ce hook s'exécute au chargement pour vérifier si un token existe déjà
  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser({ id: decodedUser.id, role: decodedUser.role });
      } catch (error) {
        // Si le token est invalide, on le supprime
        console.error("Token invalide trouvé:", error);
        localStorage.removeItem('authToken');
        setToken(null);
      }
    }
  }, [token]);

  // La fonction pour se connecter
  const login = async (email, password) => {
    try {
      const response = await api.post('/api/users/login', { email, password });
      const receivedToken = response.data.token;
      
      localStorage.setItem('authToken', receivedToken); // On stocke le token dans le navigateur
      setToken(receivedToken); // On met à jour l'état du token dans React
      
      const decodedUser = jwtDecode(receivedToken);
      setUser({ id: decodedUser.id, role: decodedUser.role }); // On met à jour l'utilisateur
      return true; // La connexion est un succès
    } catch (error) {
      console.error("Erreur de connexion:", error);
      logout(); // On nettoie tout en cas d'erreur
      return false; // La connexion est un échec
    }
  };

  // La fonction pour se déconnecter
  const logout = () => {
    localStorage.removeItem('authToken'); // On retire le token du navigateur
    setToken(null);
    setUser(null);
  };

  // On définit l'objet "value" que notre contexte va fournir
  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token, // Astuce : !!token transforme la string en booléen (true si token existe, false sinon)
  };

  // On retourne le Provider avec la "value" pour que les enfants y aient accès
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// On crée un hook personnalisé pour consommer le contexte plus facilement dans nos pages
export function useAuth() {
  return useContext(AuthContext);
}