import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardMedia, 
  Container, 
  Grid,
  useMediaQuery,
  useTheme
} 
from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';

const Acceuil = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={4} alignItems="center">
        {/* Partie texte à gauche */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
              Bienvenue sur SANGBE GROUPE EXCHANGE
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
              Votre platforme de vente,d'échange et d'achat de cryptomonnaie .
              et monnaie electronique.
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
           
              <Button 
              component={RouterLink}
              to="/connexion"
              variant="contained" 
              color="#FF7F00"
              sx={{ backgroundColor: "#FF7F00"}}
               size="large">
                Se connecter 
              </Button>
          
              <Button
              component={RouterLink}
              to="/achat"
               variant="outlined" 
               color="#FF7F00"
               sx={{Color:"#FF7F00"}}
                size="large">
                Acheter
              </Button>
            </Box>
          </Box>
        </Grid>
        
        {/* Image à droite */}
        <Grid item xs={12} md={6}>
            <img
              src="/src/assets/logocrypto.png"
              alt=""
              style={{ objectFit: 'cover' }}
            />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Acceuil;