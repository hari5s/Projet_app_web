// src/pages/CreateConventionPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function CreateConventionPage() {
  const navigate = useNavigate();
  const { user } = useAuth(); // L'étudiant actuellement connecté

  // États pour les listes déroulantes
  const [schools, setSchools] = useState([]);
  const [companies, setCompanies] = useState([]);
  
  // États pour les sélections de l'utilisateur
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');

  // États pour la gestion de l'interface (chargement, erreurs, succès)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Au chargement de la page, on va chercher la liste des écoles et entreprises
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/users');
        const allUsers = response.data;

        // On filtre les utilisateurs par rôle pour nos listes
        setSchools(allUsers.filter(u => u.role === 'School'));
        setCompanies(allUsers.filter(u => u.role === 'Company'));

      } catch (err) {
        setError('Erreur lors du chargement des données. Veuillez réessayer.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fonction appelée à la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedSchool || !selectedCompany) {
      setError('Veuillez sélectionner une école et une entreprise.');
      return;
    }

    // On prépare les données à envoyer au backend
    const conventionData = {
      studentId: user.id,
      schoolId: selectedSchool,
      companyId: selectedCompany,
      // Le statut par défaut "En attente" sera géré par le backend
    };

    try {
      await api.post('/api/conventions', conventionData);
      setSuccess('Convention créée avec succès ! Vous allez être redirigé...');
      
      // On redirige l'utilisateur vers son dashboard après 2 secondes
      setTimeout(() => {
        navigate('/dashboard-etudiant');
      }, 2000);

    } catch (err) {
      setError('Une erreur est survenue lors de la création de la convention.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center p-10">Chargement...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Nouvelle Convention</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="mb-4">
            <label htmlFor="school" className="block text-gray-700 font-semibold">École</label>
            <select
              id="school"
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            >
              <option value="" disabled>-- Choisissez une école --</option>
              {schools.map(school => (
                <option key={school.id} value={school.id}>{school.email}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="company" className="block text-gray-700 font-semibold">Entreprise</label>
            <select
              id="company"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            >
              <option value="" disabled>-- Choisissez une entreprise --</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>{company.email}</option>
              ))}
            </select>
          </div>
          
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}
          
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors">
            Créer la convention
          </button>

        </form>
      </div>
    </div>
  );
}

export default CreateConventionPage;