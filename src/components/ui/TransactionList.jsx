// src/components/ui/TransactionList.jsx
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/solid';

const TransactionList = ({ transactions }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Complété</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">En attente</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Échoué</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownIcon className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpIcon className="h-4 w-4 text-red-500" />;
      case 'purchase':
        return <ArrowDownIcon className="h-4 w-4 text-blue-500" />;
      case 'sale':
        return <ArrowUpIcon className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const getTransactionDescription = (transaction) => {
    switch (transaction.type) {
      case 'deposit':
        return `Dépôt via ${transaction.payment_method}`;
      case 'withdrawal':
        return `Retrait vers ${transaction.address?.substring(0, 8)}...`;
      case 'purchase':
        return `Achat de ${transaction.currency}`;
      case 'sale':
        return `Vente de ${transaction.currency}`;
      default:
        return transaction.type;
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        Aucune transaction trouvée
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Montant
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Référence
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-2">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="text-sm text-gray-900">
                    {getTransactionDescription(transaction)}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {transaction.amount} {transaction.currency}
                </div>
                {transaction.fee > 0 && (
                  <div className="text-xs text-gray-500">
                    Frais: {transaction.fee} {transaction.currency}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(transaction.created_at), 'dd MMMM yyyy, HH:mm', { locale: fr })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(transaction.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {transaction.payment_reference || transaction.tx_hash || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;