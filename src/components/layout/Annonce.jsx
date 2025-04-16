import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Container, 
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { createClient } from '@supabase/supabase-js';

const Annonce = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const sliderRef = useRef(null);
  
  // Initialisation du client Supabase
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Récupération des annonces actives depuis Supabase
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        // Récupérer uniquement les annonces actives
        const { data, error } = await supabase
          .from('annonce')
          .select('*')
          .eq('is_active', true)
          .order('id', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        setAnnouncements(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des annonces:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnnouncements();
  }, []);

  // Nombre d'éléments à afficher en fonction de la taille de l'écran
  const itemsToShow = isMobile ? 1 : 3;
  
  // Calcul du nombre total de pages
  const totalItems = announcements.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsToShow));
  
  // Fonction pour défiler au prochain élément
  const moveToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
  };
  
  const moveToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
  };
  
  const handleNext = () => {
    clearTimeout(timerRef.current);
    moveToNext();
    if (!isPaused) {
      timerRef.current = setTimeout(moveToNext, 5000);
    }
  };
  
  const handlePrev = () => {
    clearTimeout(timerRef.current);
    moveToPrev();
    if (!isPaused) {
      timerRef.current = setTimeout(moveToNext, 5000);
    }
  };
  
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  // Effet pour gérer le défilement automatique
  useEffect(() => {
    if (!isPaused && announcements.length > 0) {
      timerRef.current = setTimeout(moveToNext, 5000);
    }
    
    return () => {
      clearTimeout(timerRef.current);
    };
  }, [currentIndex, isPaused, announcements.length]);
  
  // Calcul des éléments visibles
  const getVisibleItems = () => {
    if (announcements.length === 0) return [];
    
    const startIdx = (currentIndex * itemsToShow) % totalItems;
    const itemsToRender = [];
    
    for (let i = 0; i < itemsToShow; i++) {
      if (startIdx + i < totalItems) {
        itemsToRender.push(announcements[startIdx + i]);
      }
    }
    
    return itemsToRender;
  };

  const visibleItems = getVisibleItems();

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box sx={{ mb: 5, textAlign: 'left' }}>
        <Typography variant="h2" component="h1" color='#FF7F00' sx={{ fontWeight: 'bold', mb: 1 }}>
          Découvrir
        </Typography>
        <Typography variant="h2" component="h1" color='#C0C0C0' sx={{ fontWeight: 'bold', mb: 2 }}>
          CryptoNews
        </Typography>
        <Typography variant="h6" component="p" sx={{ mb: 4 }}>
          Restez informé des dernières actualités du monde des cryptomonnaies.
        </Typography>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <CircularProgress sx={{ color: '#FF7F00' }} />
        </Box>
      ) : error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <Typography color="error">Une erreur est survenue: {error}</Typography>
        </Box>
      ) : announcements.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <Typography>Aucune annonce disponible pour le moment.</Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <IconButton 
              onClick={handlePrev} 
              sx={{ 
                mr: 2, 
                zIndex: 2,
                backgroundColor: 'rgba(255, 127, 0, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 127, 0, 0.2)'
                }
              }}
            >
              <ArrowBackIosIcon />
            </IconButton>
            
            <Box sx={{ 
              width: '100%', 
              overflow: 'hidden',
              position: 'relative'
            }}>
              <Box 
                ref={sliderRef}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  transition: 'transform 0.5s ease',
                }}
              >
                {visibleItems.map((item, index) => (
                  <Box 
                    key={`item-${index}`} 
                    sx={{ 
                      width: `${100 / Math.min(itemsToShow, visibleItems.length) - 2}%`, 
                      padding: theme.spacing(1),
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Card sx={{ 
                      height: '100%', 
                      borderRadius: 3,
                      boxShadow: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6
                      }
                    }}>
                      <CardContent>
                        <Box 
                          sx={{
                            height: 180,
                            backgroundColor: '#f3f3f3',
                            color: 'black',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 2,
                            borderRadius: 2,
                            mb: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor:'#FF7F00',
                              color: 'white'
                            }
                          }}
                        >
                          <Typography variant="body1" align="center">
                            {item.content}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {item.day}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>
            
            <IconButton 
              onClick={handleNext} 
              sx={{ 
                ml: 2, 
                zIndex: 2,
                backgroundColor: 'rgba(255, 127, 0, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 127, 0, 0.2)'
                }
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <IconButton 
              onClick={togglePause} 
              color="primary"
              sx={{ 
                border: `1px solid ${theme.palette.primary.main}`,
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.1)'
                }
              }}
            >
              {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
            </IconButton>
            
            {/* Indicateurs de position */}
            <Box sx={{ display: 'flex', mx: 2, alignItems: 'center' }}>
              {Array.from({ length: totalPages }).map((_, index) => (
                <Box
                  key={index}
                  onClick={() => {
                    clearTimeout(timerRef.current);
                    setCurrentIndex(index);
                    if (!isPaused) {
                      timerRef.current = setTimeout(moveToNext, 5000);
                    }
                  }}
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    mx: 0.5,
                    bgcolor: index === currentIndex ? '#FF7F00' : 'grey.300',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.2)',
                      bgcolor: index === currentIndex ? '#FF7F00' : 'grey.400',
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Annonce;