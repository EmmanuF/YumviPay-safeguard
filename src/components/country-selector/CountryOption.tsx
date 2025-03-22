
import React from 'react';

interface CountryOptionProps {
  country: {
    code: string;
    name: string;
    flagUrl: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

const CountryOption: React.FC<CountryOptionProps> = ({
  country,
  isSelected,
  onClick
}) => {
  return (
    <button
      key={country.code}
      onClick={onClick}
      className={`w-full flex items-center px-4 py-2 text-left hover:bg-primary-50 
                transition-colors ${isSelected ? 'bg-primary-50' : ''}`}
    >
      <img 
        src={country.flagUrl} 
        alt={country.name} 
        className="w-6 h-4 object-cover rounded mr-2"
        onError={(e) => {
          console.error(`❌ Country list flag load error for ${country.code}:`, e);
          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x30?text=?';
        }}
      />
      <span>{country.name}</span>
    </button>
  );
};

export default CountryOption;
