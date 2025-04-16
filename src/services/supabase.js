import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// Service d'authentification avec Supabase
export const authService = {
  // Inscription
  async signUp(email, password, fullName, phone) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone_number: phone
        }
      }
    });
    
    if (error) throw error;
    return data;
  },
  
  // Connexion
  async signIn(email, password) {
    console.log("Calling Supabase signInWithPassword with:", { email });
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email: email,
      password: password
    });
    
    if (error) {
      console.error("Supabase auth error:", error);
      throw error;
    }
    
    return data;
  },
  
  // Déconnexion
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  // Récupérer l'utilisateur actuel
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
  
  // Récupérer la session actuelle
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },
  
  // Écouter les changements d'état d'authentification
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};