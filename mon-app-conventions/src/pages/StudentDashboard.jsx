// src/pages/StudentDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom'; // <-- Importer Link
import api from '../services/api';

function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [conventions, setConventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    const fetchConventions = async () => {
      try {
        const response = await api.get('/api/conventions');
        setConventions(response.data);
      } catch (err) {
        setError('Impossible de charger vos conventions.');
      } finally {
        setLoading(false);
      }
    };
    fetchConventions();
  }, []);

  const handleCreateConvention = () => {
    navigate('/convention/nouveau');
  };

  const handleInitiate = async (conventionId) => {
    try {
      const response = await api.post(`/api/conventions/${conventionId}/initiate`);
      const token = response.data.completionToken;
      const link = `${window.location.origin}/complete/${token}`;
      setGeneratedLink(link);
    } catch (err) {
      alert("Erreur lors de la génération du lien.");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Espace Étudiant</h1>
        <button onClick={logout} className="bg-red-500 text-white py-2 px-4 rounded-lg shadow hover:bg-red-600">
          Déconnexion
        </button>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-lg mb-8 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Bienvenue, {user?.email || 'étudiant'} !
        </h2>
        <button
          onClick={handleCreateConvention}
          className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600"
        >
          Créer une nouvelle convention
        </button>
      </div>
      {generatedLink && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
          <p className="font-bold">Lien généré !</p>
          <p className="text-sm">Copiez ce lien et envoyez-le à votre entreprise :</p>
          <input type="text" readOnly value={generatedLink} className="w-full bg-blue-50 p-2 mt-2 rounded" />
        </div>
      )}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Mes Conventions</h2>
        {loading ? <p>Chargement...</p> : error ? <p className="text-red-500">{error}</p> : (
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">ID Convention</th>
                <th className="py-2 px-4 text-left">Statut</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
             {/* ----- BLOC MIS À JOUR ----- */}
            <tbody>
              {conventions.length > 0 ? conventions.map(conv => (
                <tr key={conv.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">
                    <Link to={`/convention/${conv.id}`} className="text-blue-600 hover:underline">
                      {conv.id}
                    </Link>
                  </td>
                  <td className="py-2 px-4">{conv.status}</td>
                  <td className="py-2 px-4">
                    {conv.status === 'En attente' && (
                      <button 
                        onClick={() => handleInitiate(conv.id)}
                        className="bg-blue-500 text-white text-xs py-1 px-3 rounded hover:bg-blue-600"
                      >
                        Générer le lien pour l'entreprise
                      </button>
                    )}
                  </td>
                </tr>
              )) : <tr><td colSpan="3" className="text-center py-4">Vous n'avez aucune convention.</td></tr>}
            </tbody>
            {/* ----- FIN DU BLOC ----- */}
          </table>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;