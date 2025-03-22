
import React from 'react';
import { Flag } from 'lucide-react';

interface CurrencyOptionProps {
  currency: string;
  countryName: string | undefined;
  countryCode: string | undefined;
  flagUrl: string | undefined;
  onClick: () => void;
}

const CurrencyOption: React.FC<CurrencyOptionProps> = ({
  currency,
  countryName,
  countryCode,
  flagUrl,
  onClick
}) => {
  return (
    <button
      type="button"
      className="block w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center"
      onClick={onClick}
    >
      {countryName ? (
        <>
          <img 
            src={flagUrl}
            alt={`${countryName} flag`}
            className="w-5 h-3 object-cover rounded mr-2"
            onError={(e) => {
              console.error(`❌ Flag image load error for ${countryCode}:`, e);
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x30?text=?';
            }}
          />
          <div>
            <span className="font-medium">{currency}</span>
            <span className="text-xs text-gray-500 ml-2">({countryName})</span>
          </div>
        </>
      ) : (
        <>
          <Flag className="w-4 h-4 mr-2 text-gray-500" />
          <span>{currency}</span>
        </>
      )}
    </button>
  );
};

export default CurrencyOption;
