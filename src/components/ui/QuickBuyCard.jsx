import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
  Divider,
  Grid,
  Avatar,
  Chip,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Hidden
} from '@mui/material';
import {
  AttachMoney,
  AccountBalanceWallet,
  Payment,
  Phone,
  CheckCircle,
  SimCard,
  ArrowForward,
  ContentCopy,
  ExpandMore,
  ExpandLess,
  Info
} from '@mui/icons-material';

// Import du service d'email (vous devrez créer ce fichier)
import { sendEmail } from '../../services/emailService';

const QuickBuyCard = () => {
  const [user, setUser] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('moov');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [IDtransaction, setIDtransaction] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState({
    BTC: null
  });
  const [activeStep, setActiveStep] = useState(0);
  const [paymentNumbersOpen, setPaymentNumbersOpen] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(null);

  // Admin email configuration
  const ADMIN_EMAIL = 'koffimiensie@gmail.com';

  // Payment numbers for each method
  const paymentNumbers = {
    moov: '+2250102030405',
    orange: '+2250769261631',
    mtn: '+2250505060708',
    wave: '+2250153579616'
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCryptoPrices();
    }
  }, [user, selectedCrypto]);

  const cryptos = [
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
  ];

  const fetchCryptoPrices = async () => {
    try {
      // Ici vous pouvez appeler une API externe pour obtenir les prix réels
      setCryptoPrices({
        BTC: 56851258,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des prix:", error);
      setError("Impossible de récupérer les prix des cryptomonnaies");
    }
  };

  const paymentMethods = [
    { value: 'moov', label: 'Moov Money', icon: <SimCard color="primary" /> },
    { value: 'orange', label: 'Orange Money', icon: <SimCard color="warning" /> },
    { value: 'mtn', label: 'MTN Mobile Money', icon: <SimCard color="success" /> },
    { value: 'wave', label: 'Wave', icon: <SimCard color="info" /> }
  ];

  const handleNext = () => {
    const validationErrors = [];

    if (activeStep === 0) {
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        validationErrors.push('Veuillez entrer un montant valide');
      }
    } else if (activeStep === 1) {
      if (!phoneNumber || !/^(\+?\d{1,4}[\s-]?)?\d{9,15}$/.test(phoneNumber)) {
        validationErrors.push('Numéro de téléphone invalide. Format: +code pays numéro ou numéro local (9-15 chiffres)');
      }
    } else if (activeStep === 2) {
      if (!walletAddress) {
        validationErrors.push('Veuillez entrer votre adresse de portefeuille crypto');
      }
    } else if (activeStep === 3) {
      if (!IDtransaction) {
        validationErrors.push('Veuillez entrer votre ID de transaction');
      }
    }

    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }

    setError(null);
    if (activeStep === 3) {
      handleSubmit();
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
    setError(null);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

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
    
    try {
      // Créer le contenu de l'email
      const emailSubject = `Nouvelle transaction QuickBuy - ${selectedCrypto}`;
      const emailContent = `
        Nouvelle transaction QuickBuy
        ----------------------------
        Cryptomonnaie: ${selectedCrypto}
        Montant: ${amount} FCFA
        Montant crypto: ${calculateCryptoAmount()} ${selectedCrypto}
        Méthode de paiement: ${paymentMethods.find(m => m.value === paymentMethod)?.label || '--'}
        Numéro de téléphone: ${phoneNumber}
        Adresse de portefeuille: ${walletAddress}
        ID de transaction: ${IDtransaction}
        Date: ${new Date().toLocaleString()}
        ----------------------------
        Client: ${user?.email || 'Non disponible'}
        ID Client: ${user?.id || 'Non disponible'}
      `;

      const { data, error: dbError } = await supabase
        .from('transactions')
        .insert([
          {
            amount_fiat: parseFloat(amount),
            amount_crypto: parseFloat(calculateCryptoAmount()),
            payment_method: paymentMethod,
            phone_number: phoneNumber,
            wallet_address: walletAddress,
            transaction_id: IDtransaction,
            user_id: user?.id,
            user_email: user?.email,
            status: 'pending',
            created_at: new Date().toLocaleString()
          }
        ]);
      
      // Envoyer l'email à l'admin
      const emailResult = await sendEmail({
        to: ADMIN_EMAIL,
        subject: emailSubject,
        text: emailContent,
      });
      
      if (!emailResult.success) {
        throw new Error("Échec de l'envoi de l'email: " + emailResult.error);
      }

      setSuccess("Votre validation de paiement a été soumise avec succès! Veillez patienter, vous recevrez votre cryptomonnaie dans quelques instants.");
      
      // Réinitialiser le formulaire après soumission réussie
      setAmount('');
      setPhoneNumber('');
      setWalletAddress('');
      setIDtransaction('');
      setActiveStep(0);
    } catch (err) {
      console.error("Erreur lors de l'envoi:", err);
      setError("Une erreur s'est produite lors de la validation du paiement");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculer le montant de crypto à recevoir
  const calculateCryptoAmount = () => {
    if (!amount || isNaN(parseFloat(amount)) || !cryptoPrices[selectedCrypto]) {
      return '--';
    }
    return (parseFloat(amount) / cryptoPrices[selectedCrypto]).toFixed(6);
  };
  
  // Fonction pour copier le numéro dans le presse-papiers
  const copyNumberToClipboard = (number) => {
    navigator.clipboard.writeText(number).then(() => {
      setCopiedNumber(number);
      setTimeout(() => setCopiedNumber(null), 2000);
    });
  };

  const steps = ['Détails du paiement', 'Informations de contact', 'Adresse de réception', 'ID de transaction'];

  // Sidebar avec les instructions
  const renderInstructionsSidebar = () => {
    return (
      <Card elevation={3} sx={{ 
        borderRadius: 2, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: 'primary.light',
        color: 'primary.contrastText'
      }}>
        <CardContent sx={{ p: 3, flexGrow: 1 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Info /> Instructions de paiement
          </Typography>
          
          <Divider sx={{ my: 2, borderColor: 'primary.contrastText', opacity: 0.3 }} />
          
          <Typography variant="body2" paragraph sx={{ mt: 2 }}>
            Cher client,
          </Typography>
          
          <Typography variant="body2" paragraph>
            Pour finaliser votre achat de cryptomonnaie, veuillez suivre les étapes ci-dessous :
          </Typography>
          
          <Box component="ol" sx={{ pl: 2, mt: 2 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body2">
                <strong>Effectuez votre dépôt</strong> en utilisant la méthode de paiement que vous avez sélectionnée.
              </Typography>
            </Box>
            
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body2">
                <strong>Transférez le montant exact</strong> indiqué dans votre commande vers le numéro correspondant.
              </Typography>
            </Box>
            
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body2">
                <strong>Conservez l'ID de transaction</strong> qui vous sera fourni après votre paiement.
              </Typography>
            </Box>
            
            <Box component="li" sx={{ mb: 1 }}>
              <Typography variant="body2">
                <strong>Saisissez l'ID de transaction</strong> dans le champ prévu à l'étape finale.
              </Typography>
            </Box>
          </Box>
          
          <Paper sx={{ 
            p: 2, 
            mt: 3, 
            bgcolor: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: 1,
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Important :
            </Typography>
            <Typography variant="body2">
              Sans l'ID de transaction, nous ne pourrons pas traiter votre demande. Cet identifiant unique nous permet de vérifier votre paiement et d'assurer la sécurité de la transaction.
            </Typography>
          </Paper>
          
          {activeStep === 3 && (
            <Alert 
              severity="warning" 
              icon={<Payment />}
              sx={{ mt: 3, bgcolor: 'warning.light', color: 'warning.dark' }}
            >
              N'oubliez pas de saisir l'ID de transaction fourni par votre opérateur de paiement.
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            {/* Sélection de crypto et montant */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Cryptomonnaie
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {cryptos.map((crypto) => (
                    <Chip
                      key={crypto.symbol}
                      avatar={<Avatar sx={{ bgcolor: 'transparent', color: 'inherit' }}>{crypto.icon}</Avatar>}
                      label={`${crypto.name} (${crypto.symbol})`}
                      variant={selectedCrypto === crypto.symbol ? 'filled' : 'outlined'}
                      color={selectedCrypto === crypto.symbol ? 'primary' : 'default'}
                      onClick={() => setSelectedCrypto(crypto.symbol)}
                      sx={{ 
                        borderRadius: 1,
                        borderWidth: selectedCrypto === crypto.symbol ? 0 : 1,
                        '& .MuiChip-avatar': { 
                          fontSize: '1rem',
                          width: 24,
                          height: 24
                        }
                      }}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Montant à acheter"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography color="text.secondary">FCFA</Typography>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  error={!!error && error.includes('montant')}
                  helperText={error && error.includes('montant') ? error : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                    Détails
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Prix actuel:
                      </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <Typography variant="body2">
                        {cryptoPrices[selectedCrypto] ? cryptoPrices[selectedCrypto].toLocaleString() : '--'} FCFA
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Vous recevrez:
                      </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <Typography variant="body2" fontWeight="bold">
                        {calculateCryptoAmount()} {selectedCrypto}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </>
        );
      case 1:
        return (
          <>
            {/* Méthode de paiement et numéro de téléphone */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Méthode de paiement"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method.value} value={method.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {method.icon}
                        {method.label}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              {/* New section for payment method numbers */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1, mb: 2 }}>
                  <Button 
                    fullWidth 
                    onClick={() => setPaymentNumbersOpen(!paymentNumbersOpen)}
                    sx={{ 
                      justifyContent: 'space-between', 
                      textTransform: 'none',
                      py: 1
                    }}
                    color="primary"
                  >
                    <Typography variant="subtitle2">
                      Voir les numéros de paiement
                    </Typography>
                    {paymentNumbersOpen ? <ExpandLess /> : <ExpandMore />}
                  </Button>
                  
                  <Collapse in={paymentNumbersOpen} timeout="auto" unmountOnExit>
                    <Divider sx={{ my: 1 }} />
                    <List dense sx={{ pt: 1 }}>
                      {paymentMethods.map((method) => (
                        <ListItem 
                          key={method.value}
                          secondaryAction={
                            <Button
                              size="small"
                              startIcon={<ContentCopy />}
                              onClick={() => copyNumberToClipboard(paymentNumbers[method.value])}
                            >
                              {copiedNumber === paymentNumbers[method.value] ? 'Copié!' : 'Copier'}
                            </Button>
                          }
                          sx={{ 
                            bgcolor: method.value === paymentMethod ? 'action.selected' : 'transparent',
                            borderRadius: 1
                          }}
                        >
                          <ListItemIcon>
                            {method.icon}
                          </ListItemIcon>
                          <ListItemText 
                            primary={method.label}
                            secondary={paymentNumbers[method.value]}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontSize: '0.8rem' }}>
                      Veuillez effectuer votre paiement au numéro correspondant à la méthode de paiement choisie.
                    </Typography>
                  </Collapse>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={`Numéro ${paymentMethod === 'wave' ? 'Wave' : 'Mobile Money'}`}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Format: +000XXXXXXXX ou 0XXXXXXXX"
                  error={!!error && error.includes('téléphone')}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                />
              </Grid>
            </Grid>
          </>
        );
      case 2:
        return (
          <>
            {/* Adresse du portefeuille crypto */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={`Adresse ${selectedCrypto} de réception`}
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountBalanceWallet />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  helperText="Collez votre adresse de portefeuille crypto"
                  error={!!error && error.includes('portefeuille')}
                />
              </Grid>
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                    Rappel
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Assurez-vous que l'adresse est correcte. Les transactions crypto sont irréversibles.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </>
        );
      case 3:
        return (
          <>
            {/* ID de transaction */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={`ID de votre transaction`}
                  value={IDtransaction}
                  onChange={(e) => setIDtransaction(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Payment />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  helperText="Collez votre ID de transaction"
                  error={!!error && error.includes('ID de transaction')}
                />
              </Grid>
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                    Récapitulatif
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Montant:
                      </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <Typography variant="body2" fontWeight="medium">
                        {amount} FCFA
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Crypto:
                      </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <Typography variant="body2" fontWeight="medium">
                        {calculateCryptoAmount()} {selectedCrypto}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Méthode:
                      </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <Typography variant="body2" fontWeight="medium">
                        {paymentMethods.find(m => m.value === paymentMethod)?.label || '--'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Téléphone:
                      </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <Typography variant="body2" fontWeight="medium">
                        {phoneNumber || '--'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        px: { xs: 2, sm: 3 }
      }}
    >
      <Grid container spacing={3} sx={{ maxWidth: '100%' }}>
        {/* Instructions Sidebar - Hidden on mobile */}
        <Hidden smDown>
          <Grid item md={4} lg={3}>
            {renderInstructionsSidebar()}
          </Grid>
        </Hidden>
        
        {/* Form Section */}
        <Grid item xs={12} md={8} lg={9}>
          <Card elevation={3} sx={{ borderRadius: 2, width: '100%' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography component="h1" variant="h5" sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold' }}>
                Validation du paiement
              </Typography>
              
              {/* Instructions box - Visible only on mobile */}
              <Hidden mdUp>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    mb: 3, 
                    mt: 2, 
                    borderRadius: 1, 
                    bgcolor: 'primary.light', 
                    color: 'primary.contrastText' 
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Info fontSize="small" /> Instructions
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Effectuez votre dépôt et conservez l'ID de transaction qui vous sera fourni. Cet identifiant est essentiel pour valider votre achat.
                  </Typography>
                </Paper>
              </Hidden>
              
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4, mt: 3 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              {success ? (
                <Box sx={{ textAlign: 'center', my: 4 }}>
                  <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
                  <Alert severity="success" sx={{ mb: 3 }}>
                    {success}
                  </Alert>
                  <Button 
                    variant="contained" 
                    onClick={() => setSuccess(null)}
                    sx={{ borderRadius: 1 }}
                  >
                    Nouvelle transaction
                  </Button>
                </Box>
              ) : (
                <>
                  {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {error}
                    </Alert>
                  )}

                  <Box sx={{ mb: 3 }}>
                    {renderStepContent(activeStep)}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      disabled={activeStep === 0 || isLoading}
                      sx={{ borderRadius: 1 }}
                    >
                      Retour
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={isLoading}
                      endIcon={activeStep === 3 ? <CheckCircle /> : <ArrowForward />}
                      sx={{
                        borderRadius: 1,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        px: 3
                      }}
                    >
                      {isLoading 
                        ? 'Traitement en cours...' 
                        : activeStep === 3 
                          ? 'Valider le paiement' 
                          : 'Continuer'}
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default QuickBuyCard;