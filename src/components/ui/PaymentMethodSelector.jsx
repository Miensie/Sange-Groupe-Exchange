// src/components/ui/PaymentMethodSelector.jsx
import React from 'react';

const PaymentMethodSelector = ({ options, value, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map((option) => (
        <div 
          key={option.value}
          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
            value === option.value 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onChange(option.value)}
        >
          <div className="flex items-center">
            <input
              type="radio"
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <label className="ml-3 block text-sm font-medium text-gray-700">
              {option.label}
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethodSelector;