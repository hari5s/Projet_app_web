// src/pages/CompanyCompletionPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function CompanyCompletionPage() {
  const { token } = useParams(); // Récupère le token depuis l'URL
  const navigate = useNavigate();

  const [convention, setConvention] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Les champs que l'entreprise doit remplir
  const [tutorName, setTutorName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');

  useEffect(() => {
    const fetchConvention = async () => {
      try {
        const response = await api.get(`/public/conventions/${token}`);
        setConvention(response.data);
      } catch (err) {
        setError('Ce lien est invalide ou a expiré.');
      } finally {
        setLoading(false);
      }
    };
    fetchConvention();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const companyData = {
      companyTutorName: tutorName,
      companyAddress: companyAddress
    };

    try {
      await api.post(`/public/conventions/${token}/complete`, companyData);
      setSuccess('Merci ! Les informations ont été enregistrées. La convention est maintenant prête à être signée par toutes les parties.');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    }
  };
  
  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (success) return <p className="text-green-500 p-10 text-center">{success}</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-2">Compléter la Convention</h2>
        <p className="text-center text-gray-500 mb-6">ID de la convention : {convention.id}</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="tutorName" className="block text-gray-700 font-semibold">Nom du tuteur/maître de stage</label>
            <input
              type="text"
              id="tutorName"
              value={tutorName}
              onChange={(e) => setTutorName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="companyAddress" className="block text-gray-700 font-semibold">Adresse de l'entreprise</label>
            <textarea
              id="companyAddress"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            ></textarea>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Soumettre et passer à la signature
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompanyCompletionPage;