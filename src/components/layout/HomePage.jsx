import * as React from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from "../../Hooks/Auth";

import {
  Box,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Container,
  Divider,
  MenuItem,
  Drawer,
  Typography,
  styled, 
  alpha,
  Avatar,
  Menu
}
from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

// Fonction pour gérer le défilement vers les sections
const scrollToSection = (sectionId) => (event) => {
  event.preventDefault();
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Composant pour gérer le défilement automatique lors du chargement de la page
const ScrollToHashSection = () => {
  const location = useLocation();
  
  React.useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Un petit délai pour s'assurer que tout est chargé
      }
    }
  }, [location]);
  
  return null;
};

// Composant Sitemark simplifié
const Sitemark = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
      <Box 
        component="img"
        src="/src/assets/logocrypto.png"
        alt="SANGBE GROUPE EXCHANGE Logo"
        sx={{ height: 40, mr: 1 , borderRadius: '50%' }}
      />
      <Typography
        variant="h6"
        noWrap
        component={RouterLink}
        to="/"
        sx={{
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.1rem',
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        SANGBE GROUPE EXCHANGE
      </Typography>
    </Box>
  );
};

// Composant ColorModeIconDropdown simplifié


// Composant de profil utilisateur
const UserProfileMenu = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      user(null)
      navigate('/');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-controls={open ? 'profile-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        {user?.photoURL ? (
          <Avatar 
            src={user.photoURL} 
            alt={user.displayName || "Profil"} 
            sx={{ width: 32, height: 32 }}
          />
        ) : (
          <AccountCircleIcon sx={{ color: 'primary.main' }} />
        )}
      </IconButton>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'profile-button',
        }}
      >
        <MenuItem component={RouterLink} to="/profile">
          <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
          Mon Profil
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Déconnexion
        </MenuItem>
      </Menu>
    </>
  );
};

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function HomePage() {
  const [open, setOpen] = React.useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      navigate('/');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <>
      <ScrollToHashSection />
      <AppBar
        position="fixed"
        enableColorOnDark
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <StyledToolbar variant="dense" disableGutters>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
              <Sitemark />
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button component={RouterLink} to="/" variant="text" color="info" size="small">
                  Accueil
                </Button>
                <Button 
                  component="a" 
                  href="#services" 
                  onClick={scrollToSection('services')} 
                  variant="text" 
                  color="info" 
                  size="small"
                >
                  Services
                </Button>
                <Button 
                  component="a" 
                  href="#about" 
                  onClick={scrollToSection('about')} 
                  variant="text" 
                  color="info" 
                  size="small"
                >
                  À propos
                </Button>
                <Button 
                  component="a" 
                  href="#pricing" 
                  onClick={scrollToSection('pricing')} 
                  variant="text" 
                  color="info" 
                  size="small"
                >
                  Tarifs
                </Button>
                
                <Button component="a" href='https://wa.me/message/MJ3UP75LGRNYE1' variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
                  Contact
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 1,
                alignItems: 'center',
              }}
            >
              {user ? (
                <>
                  <UserProfileMenu />
                  <Button 
                    onClick={handleLogout}
                    color="primary" 
                    variant="outlined" 
                    size="small"
                    startIcon={<LogoutIcon />}
                  >
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    component={RouterLink} 
                    to="/connexion" 
                    color="primary" 
                    variant="text" 
                    size="small"
                  >
                    Connexion
                  </Button>
                  <Button 
                    component={RouterLink} 
                    to="/inscription" 
                    color="primary" 
                    sx={{backgroundColor:'#FF7F00'}}
                    variant="contained" 
                    size="small"
                  >
                    Inscription
                  </Button>
                </>
              )}
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
              <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="top"
                open={open}
                onClose={toggleDrawer(false)}
              >
                <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <IconButton onClick={toggleDrawer(false)}>
                      <CloseRoundedIcon />
                    </IconButton>
                  </Box>

                  <MenuItem component={RouterLink} to="/">Accueil</MenuItem>
                  <MenuItem 
                    component="a" 
                    href="#services"
                    color='#FF7F00' 
                    onClick={(e) => {
                      scrollToSection('services')(e);
                      toggleDrawer(false)();
                    }}
                  >
                    Services
                  </MenuItem>
                  <MenuItem 
                    component="a" 
                    href="#about" 
                     color='#FF7F00'
                    onClick={(e) => {
                      scrollToSection('about')(e);
                      toggleDrawer(false)();
                    }}
                  >
                    À propos
                  </MenuItem>
                  <MenuItem 
                    component="a" 
                    href="#pricing" 
                     color='#FF7F00'
                    onClick={(e) => {
                      scrollToSection('pricing')(e);
                      toggleDrawer(false)();
                    }}
                  >
                    Tarifs
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/faq">FAQ</MenuItem>
                  <MenuItem component={RouterLink} to="/contact">Contact</MenuItem>
                  <Divider sx={{ my: 3 }} />
                  
                  {user ? (
                    <>
                      <MenuItem component={RouterLink} to="/profile">
                        <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
                        Mon Profil
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>
                        <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                        Déconnexion
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem>
                        <Button 
                          component={RouterLink}
                          to="/inscription"
                          variant="contained" 
                          color="#FF7F00"
                          sx={{ backgroundColor: "#FF7F00"}}
                          size="large"
                          fullWidth
                        >
                          Inscription 
                        </Button>
                      </MenuItem>
                      <MenuItem>
                        <Button 
                          component={RouterLink} 
                          to="/connexion" 
                          color="primary" 
                          variant="outlined" 
                          fullWidth
                        >
                          Connexion
                        </Button>
                      </MenuItem>
                    </>
                  )}
                </Box>
              </Drawer>
            </Box>
          </StyledToolbar>
        </Container>
      </AppBar>
    </>
  );
}