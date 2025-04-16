import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  TextField, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { createClient } from '@supabase/supabase-js';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Initialisez le client Supabase
// Remplacez ces valeurs par vos identifiants Supabase réels
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Admin = () => {
  // États pour les annonces et le formulaire
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour les notifications
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // États pour le modal d'édition/ajout
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' ou 'edit'
  const [currentAnnonce, setCurrentAnnonce] = useState({
    id: null,
    day: '',
    content: '',
    is_active: true
  });
  
  // État pour le modal de confirmation de suppression
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [annonceToDelete, setAnnonceToDelete] = useState(null);

  // Jours de la semaine pour le select
  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche', 'Weekend'];

  // Charger les annonces depuis Supabase
  const fetchAnnonces = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('annonce')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      
      setAnnonces(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des annonces:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Charger les annonces au montage du composant
  useEffect(() => {
    fetchAnnonces();
  }, []);

  // Gérer l'ouverture du modal pour ajouter une annonce
  const handleOpenAddModal = () => {
    setCurrentAnnonce({
      id: null,
      day: 'Lundi',
      content: '',
      is_active: true
    });
    setModalMode('add');
    setOpenModal(true);
  };

  // Gérer l'ouverture du modal pour éditer une annonce
  const handleOpenEditModal = (annonce) => {
    setCurrentAnnonce(annonce);
    setModalMode('edit');
    setOpenModal(true);
  };

  // Gérer la fermeture du modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAnnonce(prev => ({
      ...prev,
      [name]: name === 'is_active' ? e.target.checked : value
    }));
  };

  // Soumettre le formulaire d'ajout/édition
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (modalMode === 'add') {
        // Ajouter une nouvelle annonce
        const { data, error } = await supabase
          .from('annonce')
          .insert([
            { 
              day: currentAnnonce.day, 
              content: currentAnnonce.content,
              is_active: currentAnnonce.is_active
            }
          ])
          .select();
        
        if (error) throw error;
        
        setNotification({
          open: true,
          message: 'Annonce ajoutée avec succès',
          severity: 'success'
        });
      } else {
        // Mettre à jour une annonce existante
        const { data, error } = await supabase
          .from('annonce')
          .update({ 
            day: currentAnnonce.day, 
            content: currentAnnonce.content,
            is_active: currentAnnonce.is_active
          })
          .eq('id', currentAnnonce.id)
          .select();
        
        if (error) throw error;
        
        setNotification({
          open: true,
          message: 'Annonce mise à jour avec succès',
          severity: 'success'
        });
      }
      
      // Recharger les annonces et fermer le modal
      fetchAnnonces();
      handleCloseModal();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setNotification({
        open: true,
        message: `Erreur: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir le dialogue de confirmation de suppression
  const handleOpenDeleteDialog = (annonce) => {
    setAnnonceToDelete(annonce);
    setOpenDeleteDialog(true);
  };

  // Fermer le dialogue de confirmation de suppression
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setAnnonceToDelete(null);
  };

  // Supprimer une annonce
  const handleDelete = async () => {
    if (!annonceToDelete) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('annonce')
        .delete()
        .eq('id', annonceToDelete.id);
      
      if (error) throw error;
      
      setNotification({
        open: true,
        message: 'Annonce supprimée avec succès',
        severity: 'success'
      });
      
      // Recharger les annonces et fermer le dialogue
      fetchAnnonces();
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setNotification({
        open: true,
        message: `Erreur: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fermer la notification
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h2" component="h1" color="#FF7F00" sx={{ fontWeight: 'bold', mb: 1 }}>
          Administration
        </Typography>
        <Typography variant="h2" component="h2" color="#C0C0C0" sx={{ fontWeight: 'bold', mb: 2 }}>
          CryptoNews
        </Typography>
        <Typography variant="h6" component="p" sx={{ mb: 4 }}>
          Gérer les annonces qui apparaissent sur la page d'accueil.
        </Typography>
      </Box>
      
      {/* Bouton d'ajout d'une nouvelle annonce */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddModal}
          sx={{ 
            backgroundColor: '#FF7F00',
            '&:hover': {
              backgroundColor: '#C06000',
            }
          }}
        >
          Ajouter une annonce
        </Button>
      </Box>
      
      {/* Tableau des annonces */}
      <TableContainer component={Paper} sx={{ mb: 4, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Jour</TableCell>
              <TableCell>Contenu</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
            
            {!loading && error && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'error.main' }}>
                  Erreur: {error}
                </TableCell>
              </TableRow>
            )}
            
            {!loading && !error && annonces.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  Aucune annonce trouvée
                </TableCell>
              </TableRow>
            )}
            
            {!loading && !error && annonces.map((annonce) => (
              <TableRow key={annonce.id} hover>
                <TableCell>{annonce.id}</TableCell>
                <TableCell>{annonce.day}</TableCell>
                <TableCell>
                  {annonce.content.length > 50 
                    ? annonce.content.substring(0, 50) + '...' 
                    : annonce.content}
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'inline-block',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor: annonce.is_active ? 'success.light' : 'error.light',
                      color: 'white',
                    }}
                  >
                    {annonce.is_active ? 'Actif' : 'Inactif'}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="primary" 
                    onClick={() => handleOpenEditModal(annonce)}
                    sx={{ color: '#1976d2' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleOpenDeleteDialog(annonce)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Modal d'ajout/édition d'annonce */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>
          {modalMode === 'add' ? 'Ajouter une annonce' : 'Modifier l\'annonce'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="day-select-label">Jour</InputLabel>
              <Select
                labelId="day-select-label"
                id="day"
                name="day"
                value={currentAnnonce.day}
                label="Jour"
                onChange={handleInputChange}
              >
                {daysOfWeek.map((day) => (
                  <MenuItem key={day} value={day}>{day}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Contenu"
              name="content"
              multiline
              rows={4}
              value={currentAnnonce.content}
              onChange={handleInputChange}
              sx={{ mb: 3 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="status-select-label">Statut</InputLabel>
              <Select
                labelId="status-select-label"
                id="is_active"
                name="is_active"
                value={currentAnnonce.is_active}
                label="Statut"
                onChange={handleInputChange}
              >
                <MenuItem value={true}>Actif</MenuItem>
                <MenuItem value={false}>Inactif</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="inherit">
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading || !currentAnnonce.content || !currentAnnonce.day}
            sx={{ 
              backgroundColor: '#FF7F00',
              '&:hover': {
                backgroundColor: '#C06000',
              }
            }}
          >
            {loading ? <CircularProgress size={24} /> : modalMode === 'add' ? 'Ajouter' : 'Mettre à jour'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal de confirmation de suppression */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="inherit">
            Annuler
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained" 
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Admin;