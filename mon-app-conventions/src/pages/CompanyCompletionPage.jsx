import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function CompanyCompletionPage() {
    const { token } = useParams();
    const [convention, setConvention] = useState(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchConvention = async () => {
            try {
                const response = await api.get(`/public/company/${token}`);
                setConvention(response.data);
            } catch (err) {
                setError('Ce lien est invalide ou a expiré.');
            }
        };
        fetchConvention();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            // Dans cette version, on ne demande pas de mot de passe à l'entreprise pour simplifier.
            await api.post(`/public/company/${token}`);
            setSuccess('Merci ! La convention est maintenant prête à être signée par toutes les parties.');
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
                    <h2 className="text-2xl font-bold text-green-600 mb-4">Validation Réussie !</h2>
                    <p>{success}</p>
                </div>
            </div>
        );
    }
    
    if (error) {
         return (
             <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-lg text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!convention) {
        return <div className="p-10 text-center">Chargement...</div>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-2xl text-left">
                <h2 className="text-2xl font-bold mb-4 text-center">Validation de la Convention (Entreprise)</h2>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 mb-6">
                    <p><strong>École :</strong> {convention.schoolId}</p>
                    <p><strong>Étudiant :</strong> {convention.studentFirstName} {convention.studentLastName} ({convention.studentEmail})</p>
                    <p><strong>Tuteur de stage :</strong> {convention.tutorName}</p>
                    <p><strong>Dates :</strong> du {new Date(convention.startDate).toLocaleDateString('fr-FR')} au {new Date(convention.endDate).toLocaleDateString('fr-FR')}</p>
                </div>
                <p className="text-gray-600 mb-6 text-center">Veuillez vérifier les informations ci-dessus. En cliquant sur le bouton, vous confirmez qu'elles sont correctes et vous débloquez l'étape de signature.</p>
                <form onSubmit={handleSubmit}>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-primary-600 text-white py-2 font-semibold rounded-md">
                        {isSubmitting ? 'Validation...' : 'Confirmer et passer à la signature'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CompanyCompletionPage;