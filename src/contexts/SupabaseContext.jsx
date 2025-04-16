import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabase';

// Création du contexte
const SupabaseContext = createContext(null);

// Hook personnalisé pour utiliser le contexte
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === null) {
    throw new Error('useSupabase doit être utilisé à l\'intérieur d\'un SupabaseProvider');
  }
  return context;
};

// Fournisseur du contexte
export const SupabaseProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Récupérer la session actuelle
    const getInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);

      } catch (error) {
        console.error('Erreur lors de la récupération de la session :', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Configurer l'écouteur pour les changements d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(true);

        setLoading(false);
      }
    );

    // Nettoyer l'écouteur à la désinstallation
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fonction pour récupérer le profil utilisateur

  // Fonction pour créer un profil utilisateur si nécessaire
  const createUserProfile = async (userId) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userMetadata = userData?.user?.user_metadata || {};

      const { data, error } = await supabase
        .from('users')
        .insert([{
          id: userId,
          email: userData?.user?.email,
          full_name: userMetadata.full_name || '',
          phone: userMetadata.phone || ''
        }])
        .select();

      if (error) {
        throw error;
      }

      setProfile(data[0]);
    } catch (error) {
      console.error('Erreur lors de la création du profil :', error);
    }
  };

  // Fonction de connexion
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erreur de connexion :', error);
      throw error;
    }
  };

  // Fonction d'inscription
  const signUp = async (email, password, fullName, phone) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone
          }
        }
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erreur d\'inscription :', error);
      throw error;
    }
  };

  // Fonction de déconnexion
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Erreur de déconnexion :', error);
      throw error;
    }
  };

  // Fonction pour réinitialiser le mot de passe
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur de réinitialisation de mot de passe :', error);
      throw error;
    }
  };

  // Fonction pour mettre à jour le profil
  const updateProfile = async (updates) => {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Mettre à jour le profil dans l'état
      setProfile({
        ...profile,
        ...updates
      });

      return { success: true };
    } catch (error) {
      console.error('Erreur de mise à jour du profil :', error);
      throw error;
    }
  };

  // Fonction pour mettre à jour l'email
  const updateEmail = async (newEmail) => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur de mise à jour de l\'email :', error);
      throw error;
    }
  };

  // Fonction pour mettre à jour le mot de passe
  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur de mise à jour du mot de passe :', error);
      throw error;
    }
  };

  // Valeur du contexte à fournir
  const value = {
    supabase,
    session,
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    updateEmail,
    updatePassword
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

export default SupabaseContext;