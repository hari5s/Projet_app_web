import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function StudentCompletionPage() {
  const { token } = useParams();
  const [convention, setConvention] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phoneNumber: '', password: '', companyEmail: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // This function fetches initial data to show context to the student
    const fetchConventionData = async () => {
      try {
        const response = await api.get(`/public/student/${token}`);
        setConvention(response.data);
      } catch (err) {
        setError("Ce lien est invalide ou a expiré.");
      }
    };
    fetchConventionData();
  }, [token]);


  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await api.post(`/public/student/${token}`, formData);
      setSuccess('Merci ! Vos informations ont été enregistrées. Un email a été envoyé à l\'entreprise.');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-lg text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Opération réussie !</h2>
          <p>{success}</p>
        </div>
      </div>
    );
  }

  if (!convention && !error) {
    return <div className="p-10 text-center">Chargement...</div>;
  }
  
  if (error && !convention) {
    return (
         <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-lg text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
                <p>{error}</p>
            </div>
        </div>
    );
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-neutral-900 mb-6">Compléter mes Informations (Étudiant)</h2>
        <p className="text-center text-sm text-gray-500 mb-4">
          Pour des raisons de sécurité et pour vous permettre de suivre votre convention, veuillez créer un mot de passe.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Prénom</label>
              <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleChange} required className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Nom</label>
              <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md"/>
            </div>
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
            <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md"/>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Créez votre mot de passe</label>
            <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md"/>
          </div>
          <fieldset className="border p-4 rounded-md mt-4">
            <legend className="font-semibold px-2">Étape suivante</legend>
            <div>
              <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700">Email de l'entreprise (contact principal)</label>
              <input type="email" name="companyEmail" id="companyEmail" value={formData.companyEmail} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md"/>
            </div>
          </fieldset>
          {error && <p className="text-red-500 text-sm text-center my-2">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full bg-primary-600 text-white py-2 font-semibold rounded-md">
            {isSubmitting ? 'Enregistrement...' : 'Valider et envoyer à l\'entreprise'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentCompletionPage;