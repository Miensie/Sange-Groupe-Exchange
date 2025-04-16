import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  IconButton 
} from '@mui/material';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  LinkedIn, 
  Email, 
  Phone 
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box 
      sx={{ 
        backgroundColor: '#f3f3f3', 
        color: 'black', 
        py: 6 
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Colonne d'informations de l'entreprise */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom color='#FF7F00'>
            Sangbe Groupe Exchange
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Votre plateforme de confiance pour les transactions et investissements en cryptomonnaies.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="inherit" href="#">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" href="#">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" href="#">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" href="#">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Colonne de liens rapides */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom color='#FF7F00'>
              Liens Rapides
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="#" color="inherit" underline="hover" sx={{ mb: 1 }}>
                Accueil
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ mb: 1 }}>
                Services
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ mb: 1 }}>
                Tarifs
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ mb: 1 }}>
                À Propos
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Contact
              </Link>
            </Box>
          </Grid>

          {/* Colonne de contacts */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom color='#FF7F00'>
              Contactez-nous
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email sx={{ mr: 2 }} />
              <Typography variant="body2">
                support@cryptoplatform.com
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone sx={{ mr: 2 }} />
              <Typography variant="body2">
                +228 90 00 00 00
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Ligne de copyright */}
        <Box 
          sx={{ 
            mt: 4, 
            pt: 2, 
            borderTop: '1px solid #FF7F00', 
            textAlign: 'center' 
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} Sangbe Groupe Exchange. Tous droits réservés.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;