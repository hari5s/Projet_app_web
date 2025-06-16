// src/pages/LoginPage.jsx

import React, { useState } from 'react';
// LA CORRECTION EST ICI : On ajoute 'useLocation' à la liste des imports
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Cette ligne a besoin de l'import ci-dessus

  // On récupère la destination mémorisée par le ProtectedRoute
  const from = location.state?.from?.pathname || null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);

    if (result.success) {
      // Si une page d'origine est mémorisée, on y retourne
      if (from) {
        navigate(from, { replace: true });
      } else {
        // Sinon, on utilise la redirection par rôle classique
        if (result.user.role === 'School') {
          navigate('/dashboard');
        } else if (result.user.role === 'Student') {
          navigate('/dashboard-etudiant');
        } else {
          // Gérer le cas d'une entreprise avec un dashboard
          navigate('/');
        }
      }
    } else {
      setError('Email ou mot de passe incorrect.');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary-600">Stage</h1>
        <p className="text-neutral-600">Simplifiez la gestion de vos conventions.</p>
      </div>
      <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-neutral-900 mb-6">Connexion</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm" required />
          </div>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full bg-primary-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-primary-700 disabled:bg-gray-400">
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Pas encore de compte ? <Link to="/register" className="font-medium text-primary-600 hover:underline">Inscrivez-vous</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;