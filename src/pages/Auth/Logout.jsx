// src/pages/Auth/Logout.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

const Logout = () => {
  const [error, setError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        setIsLoggingOut(true);
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          throw error;
        }
        
        // Rediriger vers la page de connexion après déconnexion
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } catch (err) {
        console.error('Erreur lors de la déconnexion:', err.message);
        setError(err.message);
      } finally {
        setIsLoggingOut(false);
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {isLoggingOut ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Déconnexion en cours...</h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4 text-red-600">Erreur de déconnexion</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Retour au tableau de bord
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">Déconnexion réussie</h2>
            <p className="text-gray-700 mb-4">Vous avez été déconnecté avec succès.</p>
            <p className="text-gray-500 text-sm mb-4">Vous allez être redirigé vers la page de connexion...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logout;