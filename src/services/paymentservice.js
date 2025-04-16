// src/services/payment.service.js
import { supabase } from './supabase';

export const paymentService = {
  // Initialiser un paiement
  async initiatePayment(paymentDetails) {
    try {
      const { data, error } = await supabase.functions.invoke('initiate-payment', {
        body: JSON.stringify(paymentDetails)
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du paiement:', error);
      throw new Error('Impossible d\'initialiser le paiement');
    }
  },
  
  // Vérifier le statut d'un paiement
  async checkPaymentStatus(transactionId) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('status')
        .eq('id', transactionId)
        .single();
        
      if (error) throw error;
      
      return data.status;
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
      throw new Error('Impossible de vérifier le statut du paiement');
    }
  }
};