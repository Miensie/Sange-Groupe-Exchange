// services/emailService.js

// Vous pouvez utiliser un service comme EmailJS, SendGrid, ou votre propre backend
// Cet exemple utilise EmailJS qui fonctionne directement depuis le frontend
import emailjs from 'emailjs-com';

// Remplacez ces valeurs par vos identifiants EmailJS
const EMAIL_SERVICE_ID = 'service_y7ms1l6'; // à remplacer
const EMAIL_TEMPLATE_ID = 'template_lh88umi'; // à remplacer
const EMAIL_USER_ID = 'ywjYt1ySg5eh3nesk'; // à remplacer

export const sendEmail = async ({ to, subject, text}) => {
  try {
    // Initialiser EmailJS (à faire une seule fois au démarrage de l'application)
    if (!window.emailjsInitialized) {
      emailjs.init(EMAIL_USER_ID);
      window.emailjsInitialized = true;
    }

    // Préparation des paramètres pour le template
    const templateParams = {
      to_email: to,
      subject,
      message: text
    };

    // Envoi de l'email
    const response = await emailjs.send(
      EMAIL_SERVICE_ID,
      EMAIL_TEMPLATE_ID,
      templateParams
    );

    console.log('Email envoyé avec succès:', response);
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { success: false, error: error.text || error.message || 'Une erreur est survenue' };
  }
};