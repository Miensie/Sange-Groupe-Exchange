import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Button,
  Paper
} from '@mui/material';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';

const Apropos = () => {
  return (
    <Box sx={{ 
      bgcolor: '#f3f3f3', // Fond blanc beige
      py: 8, 
      minHeight: '100vh'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h4" 
              component="h3"
              sx={{ 
                fontWeight: 'bold', 
                mb: 4, 
                color: '#333',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-15px',
                  left: '0',
                  width: '100px',
                  height: '4px',
                  backgroundColor: '#f7931a',
                  borderRadius: '2px'
                }
              }}
            >
              <Box id="about">
                CONNAISSEZ-VOUS SANGBE ?
              </Box>
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', color: '#444' }}>
                Sangbe Groupe Exchange propose des services sur mesure pour aider
                chaque
                client à maîtriser l'univers des cryptomonnaies
                et progresser
                avec confiance et sécurité.
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', color: '#444' }}>
                Grâce à notre expertise en technologie blockchain et finance décentralisée
                (DeFi), Sangbe est le partenaire idéal pour tous vos besoins en
                cryptomonnaies.
              </Typography>
            </Box>
            
            <Button 
              variant="contained" 
              startIcon={<CurrencyBitcoinIcon />}
              sx={{ 
                bgcolor: '#C0C0C0',
                color: 'white',
                borderRadius: '50px',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: '#0077cc',
                }
              }}
            >
              DÉCOUVRIR SANGBE
            </Button>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                bgcolor: '#FF7F00',
                opacity: 0.2,
                zIndex: 0
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-20px',
                left: '-20px',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                bgcolor: '#OO7FFF',
                opacity: 0.15,
                zIndex: 0
              }
            }}>
                <img 
                  src="src/assets/minimalistic-still-life-assortment-with-cryptocurrency.jpg"
                  alt="Personne utilisant des services de cryptomonnaie" 
                  style={{ 
                    width: '350px', 
                    height: '400px',
                    display: 'block',
                    borderRadius: '50%'
                  }} 
                />
            </Box>
          </Grid>
        </Grid>
        
        
      </Container>
    </Box>
  );
};

export default Apropos;