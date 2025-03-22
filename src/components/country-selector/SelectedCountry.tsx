
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectedCountryProps {
  country: {
    name: string;
    flagUrl: string;
  } | null;
  onClick: () => void;
  placeholder?: string;
}

const SelectedCountry: React.FC<SelectedCountryProps> = ({
  country,
  onClick,
  placeholder = "Select a country"
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white w-full flex items-center justify-between px-4 py-3 rounded-xl 
                 text-left focus:outline-none focus:ring-2 focus:ring-primary-300 
                 border border-gray-200 transition-all shadow-sm"
    >
      {country ? (
        <div className="flex items-center">
          <img 
            src={country.flagUrl} 
            alt={country.name} 
            className="w-6 h-4 object-cover rounded mr-2"
            onError={(e) => {
              console.error(`❌ Selected country flag load error:`, e);
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x30?text=?';
            }}
          />
          <span>{country.name}</span>
        </div>
      ) : (
        <span className="text-gray-500">{placeholder}</span>
      )}
      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200`} />
    </button>
  );
};

export default SelectedCountry;
