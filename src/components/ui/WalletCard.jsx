// src/components/ui/WalletCard.jsx
import React from 'react';
import { formatCurrency } from '../../utils/formatters';

const WalletCard = ({ wallet, isSelected, onSelect }) => {
  // Obtenir l'icône de la cryptomonnaie (à remplacer par vos propres icônes)
  const getCryptoIcon = (currency) => {
    const icons = {
      BTC: '₿',
      ETH: 'Ξ',
      XOF: 'XOF',
      USD: '$',
      EUR: '€',
      // Ajoutez d'autres monnaies selon vos besoins
    };
    return icons[currency] || currency;
  };

  // Obtenir la couleur de fond en fonction de la monnaie
  const getBackgroundColor = (currency) => {
    const colors = {
      BTC: 'from-orange-400 to-orange-600',
      ETH: 'from-indigo-400 to-indigo-600',
      XOF: 'from-green-400 to-green-600',
      USD: 'from-blue-400 to-blue-600',
      EUR: 'from-purple-400 to-purple-600',
      // Ajoutez d'autres monnaies selon vos besoins
    };
    return colors[currency] || 'from-gray-400 to-gray-600';
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-200 
                 ${isSelected ? 'ring-2 ring-indigo-500 transform scale-[1.02]' : 'hover:shadow-lg'}`}
      onClick={onSelect}
    >
      <div className={`p-4 bg-gradient-to-r ${getBackgroundColor(wallet.currency)} text-white`}>
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">{getCryptoIcon(wallet.currency)}</div>
          <div className="text-sm opacity-80">Créé le {new Date(wallet.created_at).toLocaleDateString()}</div>
        </div>
        <h3 className="text-xl font-semibold mt-2">{wallet.currency}</h3>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Balance</span>
          <span className="font-semibold">{formatCurrency(wallet.balance, wallet.currency)}</span>
        </div>
        {wallet.address && (
          <div className="mt-2 text-xs text-gray-500 truncate" title={wallet.address}>
            Adresse: {wallet.address.substring(0, 10)}...{wallet.address.substring(wallet.address.length - 10)}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletCard;