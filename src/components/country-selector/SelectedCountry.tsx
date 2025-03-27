
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectedCountryProps {
  country: {
    code: string;
    name: string;
    flagUrl: string;
  } | null;
  onClick: () => void;
}

const SelectedCountry: React.FC<SelectedCountryProps> = ({ country, onClick }) => {
  return (
    <button
      type="button"
      className="flex items-center justify-between w-full px-4 py-3 border border-primary-100 rounded-xl bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-200"
      onClick={onClick}
    >
      <div className="flex items-center">
        {country ? (
          <>
            <img
              src={country.flagUrl || `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`}
              alt={`${country.name} flag`}
              className="w-6 h-4 object-cover rounded mr-3"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x30?text=?';
              }}
            />
            <span className="font-medium text-gray-800">{country.name}</span>
          </>
        ) : (
          <span className="text-gray-500">Select a country</span>
        )}
      </div>
      <ChevronDown className="h-5 w-5 text-gray-400" />
    </button>
  );
};

export default SelectedCountry;
