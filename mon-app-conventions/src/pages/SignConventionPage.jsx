// src/pages/SignConventionPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

/**
 * Affiche les détails d'une convention et permet aux parties concernées de la signer.
 */
function SignConventionPage() {
  const { id } = useParams(); // Récupère l'ID de la convention depuis l'URL
  const { user } = useAuth(); // Récupère l'utilisateur connecté

  const [convention, setConvention] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [signError, setSignError] = useState('');

  // Utilisation de useCallback pour que la fonction ne soit pas recréée inutilement
  const fetchConvention = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/conventions/${id}`);
      setConvention(response.data);
    } catch (err) {
      setError('Impossible de charger la convention. Elle n\'existe peut-être pas ou vous n\'y avez pas accès.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // On charge les données de la convention au premier chargement de la page
  useEffect(() => {
    fetchConvention();
  }, [fetchConvention]);

  // Fonction pour apposer sa signature
  const handleSign = async () => {
    setSignError('');
    try {
      await api.post(`/api/conventions/${id}/sign`);
      // Après une signature réussie, on recharge les données pour voir la mise à jour
      fetchConvention(); 
    } catch (err) {
      setSignError(err.response?.data?.message || 'Erreur lors de la signature.');
    }
  };

  // Détermine si l'utilisateur actuellement connecté peut signer cette convention
  const canSign = () => {
    if (!convention || !user || convention.status !== 'À signer') {
      return false;
    }
    if (user.role === 'Student' && user.id === convention.studentId && !convention.studentSignature) return true;
    if (user.role === 'School' && user.id === convention.schoolId && !convention.schoolSignature) return true;
    if (user.role === 'Company' && user.id === convention.companyId && !convention.companySignature) return true;
    return false;
  };

  if (loading) return <div className="p-10 text-center">Chargement de la convention...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!convention) return <div className="p-10 text-center">Convention non trouvée.</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Convention de Stage</h1>
        <p className="text-center text-gray-500 mb-8">Statut : {convention.status}</p>

        <div className="space-y-6">
          <Section title="🎓 Étudiant" id={convention.studentId} />
          <Section title="🏫 École" id={convention.schoolId} />
          <Section title="🏢 Entreprise" id={convention.companyId} tutor={convention.companyTutorName} address={convention.companyAddress} />
          
          <div>
            <h3 className="text-xl font-semibold border-b pb-2 mb-4">Signatures</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
              <SignatureBox title="Étudiant" date={convention.studentSignature} />
              <SignatureBox title="École" date={convention.schoolSignature} />
              <SignatureBox title="Entreprise" date={convention.companySignature} />
            </div>
          </div>
        </div>

        {canSign() && (
          <div className="mt-10 text-center">
            <button onClick={handleSign} className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors shadow-md">
              ✔ Signer la convention
            </button>
            {signError && <p className="text-red-500 mt-2">{signError}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// Sous-composants pour une meilleure organisation
const Section = ({ title, id, tutor, address }) => (
  <div>
    <h3 className="text-xl font-semibold border-b pb-2 mb-2">{title}</h3>
    <p><strong>ID de l'entité :</strong> {id}</p>
    {tutor && <p><strong>Tuteur :</strong> {tutor}</p>}
    {address && <p><strong>Adresse :</strong> {address}</p>}
  </div>
);

const SignatureBox = ({ title, date }) => (
  <div className="border p-4 rounded-md bg-gray-50">
    <h4 className="font-semibold text-gray-800">{title}</h4>
    {date ? (
      <p className="text-green-600 mt-2 font-medium">✓ Signé le : {new Date(date).toLocaleDateString('fr-FR')}</p>
    ) : (
      <p className="text-yellow-600 mt-2 font-medium">... En attente de signature</p>
    )}
  </div>
);

export default SignConventionPage;