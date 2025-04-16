// src/components/common/Alert.jsx
import React from 'react';

const Alert = ({ type, message }) => {
  const alertStyles = {
    error: 'bg-red-50 text-red-800 border-red-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200'
  };

  return (
    <div className={`p-4 mb-4 rounded-md border ${alertStyles[type] || alertStyles.info}`}>
      {message}
    </div>
  );
};

export default Alert;