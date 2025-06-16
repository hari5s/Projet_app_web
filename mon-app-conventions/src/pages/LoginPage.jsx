// src/pages/LoginPage.jsx

import React, { useState, useEffect } from 'react';
// On importe "Link" pour pouvoir créer le lien vers la page d'inscription
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await login(email, password);
    if (!success) {
      setError('Email ou mot de passe incorrect.');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'School') {
        navigate('/dashboard');
      } else if (user?.role === 'Student') {
        navigate('/dashboard-etudiant');
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Connexion</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors">
            Se connecter
          </button>
        </form>

        {/* ----- BLOC AJOUTÉ ----- */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Pas encore de compte ?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:underline">
            Inscrivez-vous
          </Link>
        </p>
        {/* ----- FIN DU BLOC ----- */}
        
      </div>
    </div>
  );
}

export default LoginPage;