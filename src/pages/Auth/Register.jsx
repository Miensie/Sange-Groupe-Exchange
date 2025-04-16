import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authService } from '../../services/supabase';
import {
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Lock, Person, Email, Phone, CheckCircle } from '@mui/icons-material';

// Schéma de validation
const RegisterSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Trop court!')
    .max(50, 'Trop long!')
    .required('Nom complet requis'),
  email: Yup.string()
    .email('Email invalide')
    .required('Email requis'),
  phone: Yup.string()
    .matches(/^\+?[0-9]{8,15}$/, 'Numéro de téléphone invalide')
    .required('Numéro de téléphone requis'),
  password: Yup.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial'
    )
    .required('Mot de passe requis'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre')
    .required('Confirmation du mot de passe requise'),
  terms: Yup.boolean()
    .oneOf([true], 'Vous devez accepter les conditions d\'utilisation')
    .required('Vous devez accepter les conditions d\'utilisation'),
});

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      setError(null);

      // Appel à Supabase pour l'inscription
      await authService.signUp(
        values.email,
        values.password,
        values.fullName,
        values.phone
      );

      setSuccess(true);
      setTimeout(() => {
        navigate('/connexion');
      }, 3000);
    } catch (err) {
      console.error('Erreur d\'inscription:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Lock sx={{ fontSize: 40, color: "#FF7F00", mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Créez votre compte
        </Typography>
        <Typography variant="body1" color="#FF7F00" align="center">
          Ou{' '}
          <Link to="/connexion" style={{ color: "#FF7F00", textDecoration: 'none' }}>
            connectez-vous à votre compte existant
          </Link>
        </Typography>

        {success ? (
          <Alert
            severity="success"
            icon={<CheckCircle fontSize="inherit" />}
            sx={{ width: '100%', mt: 3 }}
          >
            Inscription réussie! Un email de confirmation a été envoyé à votre adresse email.
            Vous allez être redirigé vers la page de connexion...
          </Alert>
        ) : (
          <Formik
            initialValues={{
              fullName: '',
              email: '',
              phone: '',
              password: '',
              confirmPassword: '',
              terms: false,
            }}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form style={{ width: '100%', marginTop: '16px' }}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <Field
                  as={TextField}
                  fullWidth
                  margin="normal"
                  label="Nom complet"
                  name="fullName"
                  type="text"
                  color="#FF7F00"
                  autoComplete="name"
                  error={errors.fullName && touched.fullName}
                  helperText={<ErrorMessage name="fullName" />}
                  InputProps={{
                    startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} />,
                  }}
                />

                <Field
                  as={TextField}
                  fullWidth
                  margin="normal"
                  label="Adresse email"
                  name="email"
                  type="email"
                  color="#FF7F00"
                  autoComplete="email"
                  error={errors.email && touched.email}
                  helperText={<ErrorMessage name="email" />}
                  InputProps={{
                    startAdornment: <Email sx={{ color: 'action.active', mr: 1 }} />,
                  }}
                />

                <Field
                  as={TextField}
                  fullWidth
                  margin="normal"
                  label="Numéro de téléphone"
                  name="phone"
                  type="tel"
                  color="#FF7F00"
                  autoComplete="tel"
                  placeholder="+22501234567"
                  error={errors.phone && touched.phone}
                  helperText={<ErrorMessage name="phone" />}
                  InputProps={{
                    startAdornment: <Phone sx={{ color: 'action.active', mr: 1 }} />,
                  }}
                />

                <Field
                  as={TextField}
                  fullWidth
                  margin="normal"
                  label="Mot de passe"
                  name="password"
                  type="password"
                  color="#FF7F00"
                  autoComplete="new-password"
                  error={errors.password && touched.password}
                  helperText={<ErrorMessage name="password" />}
                  InputProps={{
                    startAdornment: <Lock sx={{ color: 'action.active', mr: 1 }} />,
                  }}
                />

                <Field
                  as={TextField}
                  fullWidth
                  margin="normal"
                  label="Confirmer le mot de passe"
                  name="confirmPassword"
                  type="password"
                  color="#FF7F00"
                  autoComplete="new-password"
                  error={errors.confirmPassword && touched.confirmPassword}
                  helperText={<ErrorMessage name="confirmPassword" />}
                  InputProps={{
                    startAdornment: <Lock sx={{ color: 'action.active', mr: 1 }} />,
                  }}
                />

                <FormControlLabel
                  control={
                    <Field
                      as={Checkbox}
                      name="terms"
                      color="#FF7F00"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      J'accepte les{' '}
                      <a href="#" style={{ color: "#FF7F00", textDecoration: 'none' }}>
                        conditions d'utilisation
                      </a>{' '}
                      et la{' '}
                      <a href="#" style={{ color: "#FF7F00", textDecoration: 'none' }}>
                        politique de confidentialité
                      </a>
                    </Typography>
                  }
                />
                <ErrorMessage name="terms" component="div" style={{ color: '#d32f2f', fontSize: '0.75rem', mt: 1 }} />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || loading}
                  sx={{ mt: 3, mb: 2, backgroundColor: "#FF7F00" }}
                >
                  {loading ? <CircularProgress size={24} /> : 'S\'inscrire'}
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </Box>
    </Container>
  );
};

export default Register;