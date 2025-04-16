import { Navigate } from "react-router-dom";
import { useUser } from "../../Hooks/Auth";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { user, session } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si le processus d'authentification est terminé
    const checkAuthStatus = async () => {
      try {
        // Attendre un court instant pour permettre à Auth de finir son initialisation
        // si nécessaire
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

  // Afficher un indicateur de chargement pendant la vérification
  if (isLoading) {
    return <div>Chargement...</div>; // Vous pouvez remplacer ceci par un composant de chargement plus élaboré
  }

  // Une fois le chargement terminé, vérifier si l'utilisateur est authentifié
  if (!user) {
    console.log(user)
    console.log("Utilisateur non authentifié, redirection vers /login");
    return <Navigate to="/connexion" replace />;
  }

  // L'utilisateur est authentifié, afficher le contenu protégé
  console.log(children)
  return children;
};

export default ProtectedRoute;