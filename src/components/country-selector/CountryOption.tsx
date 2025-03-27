
import React from 'react';

interface CountryOptionProps {
  country: {
    code: string;
    name: string;
    flagUrl: string;
    isReceivingEnabled?: boolean;
    isSendingEnabled?: boolean;
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
      type="button"
      className={`flex items-center w-full px-3 py-2.5 text-left hover:bg-primary-50 transition-colors ${
        isSelected ? 'bg-primary-50 text-primary' : 'text-gray-700'
      }`}
      onClick={onClick}
    >
      <img
        src={country.flagUrl || `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`}
        alt={`${country.name} flag`}
        className="w-5 h-3 object-cover rounded mr-3 flex-shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x30?text=?';
        }}
      />
      <span className="text-sm font-medium truncate">{country.name}</span>
      <span className="ml-2 text-xs text-gray-500">({country.code})</span>
    </button>
  );
};

export default CountryOption;
