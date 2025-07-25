import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function RegisterPage() {
  const navigate = useNavigate();

  // États pour les champs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('School');

  // États pour les messages et la soumission
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // LA LIGNE QUI MANQUAIT PROBABLEMENT EST ICI
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!email || !password || !role) {
      setError('Veuillez remplir tous les champs.');
      setIsSubmitting(false); // N'oubliez pas de réinitialiser
      return;
    }

    const userData = { email, password, role };

    try {
      await api.post('/api/users/register', userData);
      setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
      console.error(err);
    } finally {
      setIsSubmitting(false); // On réactive le bouton dans tous les cas
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Créer un compte</h2>
        <form onSubmit={handleSubmit}>
          {/* Les champs du formulaire... */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1" required />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Mot de passe</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1" required />
          </div>
          <div className="mb-6">
            <label htmlFor="role" className="block text-gray-700">Je suis un(e)...</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1">
              <option value="Student">Étudiant</option>
              <option value="School">École</option>
              <option value="Company">Entreprise</option>
            </select>
          </div>
          
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}
          
          {/* Le bouton utilise la variable 'isSubmitting' */}
          <button type="submit" disabled={isSubmitting} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors disabled:bg-gray-400">
            {isSubmitting ? 'Envoi en cours...' : 'S\'inscrire'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Déjà un compte ?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;