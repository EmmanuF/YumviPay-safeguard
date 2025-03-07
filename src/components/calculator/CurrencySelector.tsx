
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ value, onChange, options, label }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center bg-primary-50 rounded-lg px-4 py-2"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <span className="font-medium">{value}</span>
        <ChevronDown className="ml-2 h-4 w-4" />
      </button>
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-24 bg-white rounded-lg shadow-lg z-10">
          {options.map((option) => (
            <button
              key={option}
              className="block w-full text-left px-4 py-2 hover:bg-gray-50"
              onClick={() => {
                onChange(option);
                setShowDropdown(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
