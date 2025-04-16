import React, { useState, useEffect } from 'react';
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
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Validation du mot de passe
  const validatePassword = (pwd) => {
    // Au moins 8 caractères, une majuscule, un chiffre et un caractère spécial
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(pwd);
  };

  useEffect(() => {
    // Vérifier si l'utilisateur a été redirigé avec un hash de récupération
    const { data } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          // L'utilisateur est dans le processus de récupération de mot de passe
          setSuccess('Vous pouvez maintenant définir un nouveau mot de passe.');
        }
      }
    );

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation des champs
    if (!password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!validatePassword(password)) {
      setError('Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial');
      return;
    }

    setLoading(true);

    try {
      // Mettre à jour le mot de passe
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      // Message de succès
      setSuccess('Mot de passe réinitialisé avec succès');
      
      // Redirection vers la page de connexion après un court délai
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      // Gestion des erreurs spécifiques
      switch (err.message) {
        case 'New password should be different from the current password':
          setError('Le nouveau mot de passe doit être différent de l\'ancien');
          break;
        case 'Password update failed':
          setError('La mise à jour du mot de passe a échoué. Veuillez réessayer.');
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
          Réinitialisation du mot de passe
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ width: '90%', mb: 3,textAlign: 'center'}}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            sx={{ width: '90%', mb: 3, textAlign: 'center'}}
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
            label="Nouveau mot de passe"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            color="#FF7F00"
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            helperText="Au moins 8 caractères, une majuscule, un chiffre et un caractère spécial"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Confirmer le mot de passe"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            color="#FF7F00"
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            bgcolor="#FF7F00"
            sx={{ 
              mt: 3, 
              mb: 2, 
              padding: 1.5 
            }}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              'Réinitialiser le mot de passe'
            )}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default ResetPassword;