
import React from 'react';
import { ChevronDown, Flag } from 'lucide-react';

interface SelectedCurrencyProps {
  currency: string;
  countryName?: string;
  flagUrl?: string;
  onClick: () => void;
}

const SelectedCurrency: React.FC<SelectedCurrencyProps> = ({
  currency,
  countryName,
  flagUrl,
  onClick
}) => {
  return (
    <button
      type="button"
      className="flex items-center bg-primary-50 rounded-lg px-4 py-2 w-full justify-between"
      onClick={onClick}
    >
      {countryName && flagUrl ? (
        <div className="flex items-center">
          <img 
            src={flagUrl}
            alt={`${countryName} flag`}
            className="w-5 h-3 object-cover rounded mr-2"
            onError={(e) => {
              console.error(`❌ Selected flag image load error:`, e);
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x30?text=?';
            }}
          />
          <span className="font-medium mr-1">{currency}</span>
          <span className="text-xs text-gray-500">({countryName})</span>
        </div>
      ) : (
        <div className="flex items-center">
          <Flag className="w-4 h-4 mr-2 text-gray-500" />
          <span className="font-medium">{currency}</span>
        </div>
      )}
      <ChevronDown className="ml-2 h-4 w-4" />
    </button>
  );
};

export default SelectedCurrency;
