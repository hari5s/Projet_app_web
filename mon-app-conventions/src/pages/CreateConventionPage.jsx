// src/pages/CreateConventionPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function CreateConventionPage() {
  const navigate = useNavigate();

  // On crée un état pour chaque champ du formulaire
  const [formData, setFormData] = useState({
    studentEmail: '',
    companyEmail: '',
    tutorName: '',
    tutorPhone: '',
    companyDirectorName: '',
    startDate: '',
    endDate: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Une seule fonction pour gérer les changements de tous les champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      // Notre API service ajoute le token de l'école automatiquement
      await api.post('/api/conventions', formData);
      setSuccess('Convention initiée avec succès ! Un email a été envoyé à l\'étudiant. Vous allez être redirigé...');

      setTimeout(() => {
        navigate('/dashboard'); // On redirige l'école vers son dashboard
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-neutral-900 mb-6">Initier une Convention</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section Étudiant */}
          <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-semibold px-2">Informations Étudiant</legend>
            <div>
              <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700">Email de l'étudiant</label>
              <input type="email" name="studentEmail" id="studentEmail" value={formData.studentEmail} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm" required />
              <p className="text-xs text-gray-500 mt-1">L'étudiant recevra une invitation à cette adresse pour compléter sa partie.</p>
            </div>
          </fieldset>

          {/* Section Entreprise */}
          <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-semibold px-2">Informations Entreprise & Stage</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700">Email de l'entreprise (contact principal)</label>
                <input type="email" name="companyEmail" id="companyEmail" value={formData.companyEmail} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm" required />
              </div>
              <div>
                <label htmlFor="companyDirectorName" className="block text-sm font-medium text-gray-700">Nom du représentant de l'entreprise</label>
                <input type="text" name="companyDirectorName" id="companyDirectorName" value={formData.companyDirectorName} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm" required />
              </div>
              <div>
                <label htmlFor="tutorName" className="block text-sm font-medium text-gray-700">Nom du tuteur de stage</label>
                <input type="text" name="tutorName" id="tutorName" value={formData.tutorName} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm" required />
              </div>
              <div>
                <label htmlFor="tutorPhone" className="block text-sm font-medium text-gray-700">Téléphone du tuteur</label>
                <input type="tel" name="tutorPhone" id="tutorPhone" value={formData.tutorPhone} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Date de début du stage</label>
                <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm" required />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Date de fin du stage</label>
                <input type="date" name="endDate" id="endDate" value={formData.endDate} onChange={handleChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm" required />
              </div>
            </div>
          </fieldset>
          
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}
          
          <button type="submit" disabled={isSubmitting} className="w-full bg-primary-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400">
            {isSubmitting ? 'Envoi en cours...' : 'Lancer le processus et envoyer l\'invitation'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateConventionPage;