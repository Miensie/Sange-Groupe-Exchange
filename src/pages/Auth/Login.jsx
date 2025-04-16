import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';

// This should ideally be in environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Common error messages for better user experience
const ERROR_MESSAGES = {
  INVALID_LOGIN: "Email ou mot de passe incorrect",
  INVALID_EMAIL: "Format d'email invalide",
  NETWORK_ERROR: "Problème de connexion au serveur",
  RATE_LIMIT: "Trop de tentatives. Veuillez réessayer plus tard",
  SERVER_ERROR: "Erreur serveur. Veuillez réessayer ultérieurement",
  EMPTY_FIELDS: "Veuillez remplir tous les champs",
  DEFAULT: "Une erreur est survenue lors de la connexion"
};

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });
  const navigate = useNavigate();

  // Handle input changes for all form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general error when user changes any field
    if (error) {
      setError(null);
    }
  };

  // Validate form before submission
  const validateForm = () => {
    let valid = true;
    const newFieldErrors = { email: '', password: '' };
    
    // Email validation
    if (!formData.email) {
      newFieldErrors.email = "L'email est requis";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newFieldErrors.email = "Format d'email invalide";
      valid = false;
    }
    
    // Password validation
    if (!formData.password) {
      newFieldErrors.password = "Le mot de passe est requis";
      valid = false;
    }
    
    setFieldErrors(newFieldErrors);
    return valid;
  };

  // Map Supabase error codes to user-friendly messages
  const getErrorMessage = (error) => {
    if (!error) return ERROR_MESSAGES.DEFAULT;
    
    // Common Supabase auth error codes
    const errorCode = error.code;
    const errorMessage = error.message?.toLowerCase() || '';
    
    if (errorMessage.includes('invalid login') || errorMessage.includes('invalid email')) {
      return ERROR_MESSAGES.INVALID_LOGIN;
    } else if (errorMessage.includes('network')) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    } else if (errorMessage.includes('rate limit')) {
      return ERROR_MESSAGES.RATE_LIMIT;
    } else if (errorCode === 'auth/invalid-email') {
      return ERROR_MESSAGES.INVALID_EMAIL;
    } else if (errorCode && errorCode.startsWith('5')) {
      return ERROR_MESSAGES.SERVER_ERROR;
    }
    
    return error.message || ERROR_MESSAGES.DEFAULT;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      console.log('Tentative de connexion avec:', formData.email);
      
      // Try to sign in with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });
      
      // Check for authentication errors
      if (authError) {
        throw authError;
      }
      
      console.log('Connexion réussie, données de session:', data);
      
      // Get the session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.warn('Problème lors de la récupération de la session:', sessionError);
      } else {
        console.log('Session après connexion:', sessionData);
      }
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Connexion réussie!',
        severity: 'success'
      });
      
      // Navigate to home page after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (err) {
      console.error('Erreur de connexion:', err);
      
      // Set user-friendly error message
      const userMessage = getErrorMessage(err);
      setError(userMessage);
      
      // Handle specific cases for field errors
      if (err.message?.toLowerCase().includes('email')) {
        setFieldErrors(prev => ({
          ...prev,
          email: userMessage
        }));
      } else if (err.message?.toLowerCase().includes('password')) {
        setFieldErrors(prev => ({
          ...prev,
          password: userMessage
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: 'white',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
          Connexion
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            name="email"
            color="#FF7F00"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            autoFocus
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Mot de passe"
            type="password"
            name="password"
            color="#FF7F00"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            error={!!fieldErrors.password}
            helperText={fieldErrors.password}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{ mt: 3, mb: 2, padding: 1.5, backgroundColor: "#FF7F00" }}
          >
            {loading ? <CircularProgress size={24} /> : 'Se connecter'}
          </Button>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Link component={RouterLink} to="/inscription" variant="body2" color="#FF7F00">
            Pas encore de compte ? S'inscrire
          </Link>
          <Link component={RouterLink} to="/forgot-password" variant="body2" color="#FF7F00">
            Mot de passe oublié ?
          </Link>
        </Box>
      </Box>
      
      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Login;