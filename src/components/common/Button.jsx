// src/components/common/Button.jsx
import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  fullWidth = false, 
  disabled = false, 
  className = '', 
  onClick 
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
        fullWidth ? 'w-full' : ''
      } ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;