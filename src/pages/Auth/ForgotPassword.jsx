import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Alert, 
  CircularProgress,
  Link
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Validation de l'email
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation de l'email
    if (!email) {
      setError('Veuillez saisir votre adresse email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Format d\'email invalide');
      return;
    }

    setLoading(true);

    try {
      // Envoi de l'email de réinitialisation via Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        throw error;
      }

      // Message de succès
      setSuccess('Un email de réinitialisation a été envoyé. Vérifiez votre boîte de réception.');
      
      // Réinitialiser le formulaire après un délai
      setTimeout(() => {
        setEmail('');
      }, 3000);

    } catch (err) {
      // Gestion des erreurs spécifiques
      switch (err.message) {
        case 'User not found':
          setError('Aucun compte n\'est associé à cet email');
          break;
        case 'Rate limit exceeded':
          setError('Trop de tentatives. Veuillez réessayer plus tard.');
          break;
        default:
          setError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
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
        <Typography 
          component="h1" 
          variant="h4" 
          sx={{ 
            mb: 3, 
            textAlign: 'center' 
          }}
        >
          Mot de passe oublié
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ width: '90%', mb: 3, textAlign: 'center' }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            sx={{ width: '90%', mb: 3, textAlign: 'center' }}
          >
            {success}
          </Alert>
        )}

        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ width: '100%' }}
        >
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            color="#FF7F00"
            autoComplete="email"
            autoFocus
            error={!!error}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{ 
              mt: 3, 
              mb: 2, 
              padding: 1.5,
              backgroundColor: "#FF7F00"
            }}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              'Réinitialiser le mot de passe'
            )}
          </Button>
        </Box>

        <Box 
          sx={{ 
            mt: 2, 
            textAlign: 'center' 
          }}
        >
          <Link 
            component={RouterLink} 
            to="/connexion" 
            variant="body2"
            color="#FF7F00"
          >
            Retour à la connexion
          </Link>
        </Box>
      </Box>
    </Container>
  );
}

export default ForgotPassword;