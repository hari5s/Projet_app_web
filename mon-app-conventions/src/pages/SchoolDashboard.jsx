// src/pages/SchoolDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function SchoolDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [conventions, setConventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchConventions = async () => {
      try {
        const response = await api.get('/api/conventions');
        setConventions(response.data);
      } catch (err) {
        setError('Impossible de charger la liste des conventions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConventions();
  }, [user]); 


  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Signée': return 'bg-green-100 text-green-800';
      case 'À signer': return 'bg-yellow-100 text-yellow-800';
      case 'Refusée': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) return <div className="text-center p-10">Chargement des conventions...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard École</h1>
        <button onClick={logout} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
          Déconnexion
        </button>
      </div>

      {/* --- BLOC AJOUTÉ --- */}
      <div className="mb-6 text-right">
        <button 
          onClick={() => navigate('/convention/nouveau')}
          className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Créer une nouvelle convention
        </button>
      </div>
      {/* --- FIN DU BLOC --- */}
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Liste des Conventions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">ID Étudiant</th>
                <th className="py-2 px-4 text-left">Tuteur Entreprise</th>
                <th className="py-2 px-4 text-left">Statut</th>
              </tr>
            </thead>
            <tbody>
              {conventions.length > 0 ? (
                conventions.map((conv) => (
                  <tr key={conv.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">
                      <Link to={`/convention/${conv.id}`} className="text-blue-600 hover:underline">
                        {conv.studentId}
                      </Link>
                    </td>
                    <td className="py-2 px-4">{conv.companyTutorName || 'N/A'}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(conv.status)}`}>
                        {conv.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">Aucune convention à afficher.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SchoolDashboard;