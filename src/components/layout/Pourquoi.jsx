import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Container } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SecurityIcon from '@mui/icons-material/Security';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
        },
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: '10%',
          width: '80%',
          height: '3px',
          backgroundColor: 'primary.main',
          borderRadius: '2px'
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box 
          sx={{ 
            mb: 2, 
            display: 'inline-flex',
            backgroundColor: '#FF7F00',
            borderRadius: 2,
            p: 1.5
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="h2" gutterBottom fontWeight="600">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const FeatureCards = () => {
  const features = [
    {
      icon: <MonetizationOnIcon color="primary" fontSize="large" />,
      title: "Prix abordable",
      description: "Profitez des taux les plus compétitifs du marché des cryptomonnaies. Nous vous offrons les meilleurs prix sans frais cachés."
    },
    {
      icon: <SwapHorizIcon color="primary" fontSize="large" />,
      title: "Facilité de transaction",
      description: "Nos composants sont aussi flexibles qu'ils sont puissants. Vous avez toujours un contrôle total sur vos transactions."
    },
    {
      icon: <SupportAgentIcon color="primary" fontSize="large" />,
      title: "Assistance 24h/24",
      description: "Notre équipe d'experts est disponible à tout moment pour répondre à vos questions et résoudre rapidement vos problèmes."
    },
    {
      icon: <SecurityIcon color="primary" fontSize="large" />,
      title: "Fiabilité et sécurité",
      description: "Nous croyons en la sécurité avant tout. C'est pourquoi chaque fonctionnalité est conçue avec une protection optimale."
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        align="center" 
        gutterBottom 
        fontWeight="bold"
        sx={{ mb: 6 }}
      >
        Nos avantages
      </Typography>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <FeatureCard 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description} 
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FeatureCards;