import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser} from "../../Hooks/Auth";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Grid,
  TextField,
  Button,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  Tabs,
  Tab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip
} from '@mui/material';

import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SaveIcon from '@mui/icons-material/Save';
import SecurityIcon from '@mui/icons-material/Security';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// Composant TabPanel pour gérer les onglets
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Profil() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [fileUpload, setFileUpload] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  
  // État pour les transactions
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Données du formulaire
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phoneNumber: "",
    create: "",
  });

  // Récupérer les données de profil de Supabase
  const fetchUserProfile = async (userId) => {
    try {
      setProfileLoading(true);
      
      // Récupérer les données depuis la table 'profiles'
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        // Mettre à jour les données du formulaire avec les données récupérées
        setFormData({
          displayName: user.displayName || data.full_name || "",
          email: user.email || "",
          phoneNumber: data.phone_number || "",
          create: data.created_at,
        });
        
        // Mettre à jour l'URL de la photo si disponible
        if (data.avatar_url) {
          setPreviewURL(data.avatar_url);
        } else if (user.photoURL) {
          setPreviewURL(user.photoURL);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
      showAlert("Impossible de charger les données du profil", "error");
    } finally {
      setProfileLoading(false);
    }
  };

  // Récupérer les transactions de l'utilisateur
  const fetchUserTransactions = async (userId) => {
    try {
      setTransactionsLoading(true);
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setTransactions(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions:", error);
      showAlert("Impossible de charger l'historique des transactions", "error");
    } finally {
      setTransactionsLoading(false);
    }
  };

  // Charger les données utilisateur
  useEffect(() => {
    if (user) {
      // Initialiser avec les données de base de l'utilisateur
      setFormData({
        displayName: user.displayName || "",
        email: user.email || "",
        phoneNumber: "",
        create: "",
      });
      
      if (user.photoURL) {
        setPreviewURL(user.photoURL);
      }
      
      // Récupérer les données complètes du profil depuis Supabase
      fetchUserProfile(user.id);
    } else {
      // Rediriger si non connecté
      navigate('/connexion');
    }
  }, [user, navigate]);

  // Charger les transactions quand l'onglet historique est sélectionné
  useEffect(() => {
    if (user && tabValue === 1) {
      fetchUserTransactions(user.id);
    }
  }, [user, tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const showAlert = (message, severity = "success") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setOpenAlert(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileUpload(file);
      // Créer un URL de prévisualisation
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewURL(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Pagination pour les transactions
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Formatter la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };


  // Fonction pour télécharger une image vers le bucket Supabase Storage
  const uploadProfileImage = async (file, userId) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Télécharger le fichier
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) throw uploadError;
      
      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error("Erreur de téléchargement:", error);
      throw new Error("Échec du téléchargement de l'image");
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      let avatarUrl = user.photoURL;
      
      // Télécharger l'image si une nouvelle a été sélectionnée
      if (fileUpload) {
        avatarUrl = await uploadProfileImage(fileUpload, user.id);
      }
      
      // Mettre à jour le profil dans Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          updated_at: new Date(),
          full_name: formData.displayName,
          phone_number: formData.phoneNumber,
          created_at: formData.create,
          avatar_url: avatarUrl
        }, {
          onConflict: 'id'
        });
        
      if (error) throw error;
      
      // Mettre à jour le displayName dans Firebase Auth si vous utilisez également Firebase
      // Cette partie dépend de votre implémentation de updateUserProfile
      try {
        // Supposons que updateUserProfile est une fonction qui met à jour le profil dans Firebase Auth
        // await updateUserProfile({
        //   displayName: formData.displayName,
        //   photoURL: avatarUrl
        // });
      } catch (authError) {
        console.warn("Impossible de mettre à jour le profil d'authentification:", authError);
      }
      
      showAlert("Profil mis à jour avec succès!");
      setFileUpload(null); // Réinitialiser le fichier après la mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      showAlert("Erreur lors de la mise à jour du profil. Veuillez réessayer.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      user(null)
      navigate('/');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      showAlert("Erreur lors de la déconnexion", "error");
    }
  };

  const handleDeleteAccount = () => {
    setOpenConfirmDialog(true);
  };

  const confirmDeleteAccount = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // 1. Supprimer l'avatar si existant
      if (previewURL && previewURL.includes('avatars')) {
        const urlParts = previewURL.split('/');
        const avatarToDelete = urlParts[urlParts.length - 1];
        
        const { error: storageError } = await supabase.storage
          .from('avatars')
          .remove([avatarToDelete]);
        
        if (storageError) console.warn("Échec suppression avatar:", storageError);
      }
  
      // 2. Appeler la fonction serveur pour suppression
      const { error: functionError } = await supabase.functions.invoke('rapid-function', {
        body: { action: 'delete_account', user_id: user.id },
      });
  
      if (functionError) throw functionError;
  
      // 3. Déconnexion et nettoyage
      await supabase.auth.signOut();
      // Remove logged in user from state
      user(null);
      
      setOpenConfirmDialog(false);
      showAlert("Compte supprimé avec succès");
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error("Erreur suppression compte:", error);
      showAlert(`Échec de la suppression: ${error.message}`, "error");
    } finally {
      setLoading(false);
      setOpenConfirmDialog(false);
    }
  };

  // Obtenir le statut pour affichage avec une puce
  const getStatusChip = (status) => {
    let color;
    switch(status) {
      case 'completed':
        color = 'success';
        break;
      case 'pending':
        color = 'warning';
        break;
      case 'failed':
        color = 'error';
        break;
      default:
        color = 'default';
    }
    
    return <Chip label={status} color={color} size="small" />;
  };

  if (!user) {
    return <CircularProgress sx={{ m: 4 }} />;
  }

  // Afficher un indicateur de chargement pendant la récupération des données du profil
  if (profileLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Chargement du profil...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Mon Profil
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={4}>
          {/* Colonne de gauche avec avatar et infos de base */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Avatar 
                src={previewURL} 
                sx={{ 
                  width: 150, 
                  height: 150, 
                  mb: 2,
                  border: '3px solid',
                  borderColor: 'primary.main'
                }}
              />
              <label htmlFor="upload-photo">
                <input
                  style={{ display: 'none' }}
                  id="upload-photo"
                  name="upload-photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CameraAltIcon />}
                >
                  Changer la photo
                </Button>
              </label>
            </Box>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Informations de base
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Nom:</strong> {formData.displayName || 'Non défini'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Email:</strong> {formData.email}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Membre depuis:</strong> {formData.create}
                </Typography>
              </CardContent>
            </Card>

            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteAccount}
              fullWidth
              sx={{ mt: 2 }}
            >
              Supprimer mon compte
            </Button>
          </Grid>

          {/* Colonne de droite avec onglets */}
          <Grid item xs={12} md={8}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="profil tabs">
                <Tab label="Éditer Profil" icon={<SettingsIcon />} iconPosition="start" />
                <Tab label="Historique" icon={<HistoryIcon />} iconPosition="start" />
              </Tabs>
            </Box>

            {/* Onglet Éditer Profil */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nom complet"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    disabled
                    helperText="L'email ne peut pas être modifié"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Téléphone"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Enregistrer les modifications"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{ ml: 2 }}
                  >
                    Déconnexion
                  </Button>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Onglet Historique */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                Historique des transactions
              </Typography>

              {transactionsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : transactions.length > 0 ? (
                <>
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="transactions table">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: 'primary.light' }}>
                          <TableCell>Date</TableCell>
                          <TableCell>Moyen de paiement</TableCell>
                          <TableCell>Montant</TableCell>
                          <TableCell>Cryptomonnaie</TableCell>
                          <TableCell>ID transaction</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transactions
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((transaction) => (
                            <TableRow key={transaction.id} hover>
                              <TableCell>{formatDate(transaction.created_at)}</TableCell>
                              <TableCell>{transaction.payment_method}</TableCell>
                              <TableCell>{transaction.amount_fiat} FCFA</TableCell>
                              <TableCell>{transaction.amount_crypto} BTC</TableCell>
                              <TableCell>{transaction.transaction_id}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={transactions.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Lignes par page:"
                  />
                </>
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Aucune transaction à afficher.
                </Alert>
              )}
            </TabPanel>
          </Grid>
        </Grid>
      </Paper>

      {/* Snackbar pour les notifications */}
      <Snackbar 
        open={openAlert} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      {/* Dialogue de confirmation pour suppression de compte */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer votre compte? Cette action est irréversible et toutes vos données seront perdues.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={confirmDeleteAccount} color="error" autoFocus>
            Confirmer la suppression
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}