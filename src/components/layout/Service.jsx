import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  Button,
} from '@mui/material';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const Services = () => {
  const services = [
    {
      title: "Vente de Cryptomonnaie",
      description: "Vendez vos cryptomonnaies en toute sécurité avec nos services de vente rapides et fiables.",
      icon: <CurrencyBitcoinIcon sx={{ fontSize: 60, color: '#f7931a' }} />
    },
    {
      title: "Échange de Cryptomonnaie",
      description: "Échangez facilement entre différentes cryptomonnaies grâce à notre plateforme d'échange optimisée.",
      icon: <CurrencyExchangeIcon sx={{ fontSize: 60, color: '#627EEA' }} />
    },
    {
      title: "Achat de Cryptomonnaie",
      description: "Achetez des cryptomonnaies en toute simplicité avec nos solutions d'achat sécurisées.",
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 60, color: '#00aeff' }} />
    }
  ];
  
  return (
    <Box sx={{ bgcolor: '#000000', py: 8, color: 'white' }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h4" 
          component="h3" 
          align="center" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            mb: 6, 
            textTransform: 'uppercase',
            letterSpacing: '1px',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100px',
              height: '4px',
              backgroundColor: '#f7931a',
              borderRadius: '2px'
            }
          }}
        >
           <Box id="services" >
             Nos Services
           </Box>
        </Typography>
        
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                bgcolor: 'rgba(40, 40, 40, 0.9)', 
                color: 'white',
                borderRadius: 2,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.4)'
                }
              }}>
                <CardHeader
                  titleTypographyProps={{ align: 'center', variant: 'h5', fontWeight: 'bold' }}
                  title={service.title}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  {service.icon}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography align="center">
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
              
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Services;