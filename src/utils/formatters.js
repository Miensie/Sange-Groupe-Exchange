// src/utils/formatters.js
export const formatCurrency = (amount, currency = 'USD') => {
    // Les options pour chaque devise
    const options = {
      USD: { style: 'currency', currency: 'USD' },
      EUR: { style: 'currency', currency: 'EUR' },
      XOF: { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 },
      BTC: { minimumFractionDigits: 8, maximumFractionDigits: 8 },
      ETH: { minimumFractionDigits: 6, maximumFractionDigits: 6 },
    };
  
    const value = Number(amount);
    
    // Formater les cryptomonnaies spécifiquement
    if (currency === 'BTC') {
      return `₿ ${value.toLocaleString(undefined, options.BTC)}`;
    } else if (currency === 'ETH') {
      return `Ξ ${value.toLocaleString(undefined, options.ETH)}`;
    }
    
    // Utiliser l'option par défaut pour la devise ou USD comme fallback
    return value.toLocaleString(undefined, options[currency] || options.USD);
  };
  
  export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };