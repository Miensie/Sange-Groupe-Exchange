// ProtectedRouteAdmin.jsx - Fix option 2 (redirect admins to admin page)
import { Navigate } from "react-router-dom";
import { useUser } from "../../Hooks/Auth";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const ProtectedRouteAdmin = ({ children }) => {
  const { user, session } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    console.log("Utilisateur non authentifié, redirection vers /login");
    return <Navigate to="/connexion" replace />;
  }

  else{
    if (user.id === import.meta.env.VITE_ADMIN) {
      //navigate('/admin');
      return children
  }
  }
  
  // For non-admin authenticated users, show the protected content
};

export default ProtectedRouteAdmin;