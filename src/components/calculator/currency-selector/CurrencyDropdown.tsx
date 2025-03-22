
import React from 'react';
import { useCountries } from '@/hooks/useCountries';
import CurrencyOption from './CurrencyOption';

interface CurrencyDropdownProps {
  options: string[];
  label: string;
  onSelect: (currency: string) => void;
}

const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({ 
  options, 
  label, 
  onSelect 
}) => {
  const { countries, isLoading } = useCountries();

  const renderCurrencyOptions = () => {
    if (isLoading) {
      console.log(`⏳ CurrencyDropdown - Loading currencies...`);
      return <div className="text-center p-4">Loading currencies...</div>;
    }
    
    if (!options || options.length === 0) {
      console.log(`⚠️ No currencies available for ${label}`);
      return <div className="text-center p-4">No currencies available</div>;
    }
    
    return options.map((currency) => {
      // Get country information for this currency
      const country = countries.find(c => c.currency === currency);
      
      // Fallback country data if not found in countries array
      const fallbackMap: {[key: string]: {code: string, name: string}} = {
        'USD': { code: 'us', name: 'United States' },
        'EUR': { code: 'eu', name: 'European Union' },
        'GBP': { code: 'gb', name: 'United Kingdom' },
        'XAF': { code: 'cm', name: 'Cameroon' },
        'NGN': { code: 'ng', name: 'Nigeria' },
        'KES': { code: 'ke', name: 'Kenya' }
      };
      
      // Prepare display data
      let countryName: string | undefined;
      let countryCode: string | undefined;
      let flagUrl: string | undefined;
      
      if (country) {
        countryName = country.name;
        countryCode = country.code;
        flagUrl = country.flagUrl || `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`;
      } else if (fallbackMap[currency]) {
        countryName = fallbackMap[currency].name;
        countryCode = fallbackMap[currency].code.toUpperCase();
        flagUrl = `https://flagcdn.com/w80/${fallbackMap[currency].code.toLowerCase()}.png`;
      }
      
      return (
        <CurrencyOption 
          key={currency}
          currency={currency}
          countryName={countryName}
          countryCode={countryCode}
          flagUrl={flagUrl}
          onClick={() => {
            console.log(`🖱️ Currency selected: ${currency}`);
            onSelect(currency);
          }}
        />
      );
    });
  };

  return (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 max-h-60 overflow-hidden border border-gray-200">
      <div className="overflow-y-auto max-h-[15rem] overscroll-contain">
        {renderCurrencyOptions()}
      </div>
    </div>
  );
};

export default CurrencyDropdown;
