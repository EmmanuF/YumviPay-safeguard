
import React, { useState, useEffect } from 'react';
import { ChevronDown, Flag } from 'lucide-react';
import { useCountries } from '@/hooks/useCountries';

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  value, 
  onChange, 
  options, 
  label 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { countries, isLoading } = useCountries();
  const [selectedCountry, setSelectedCountry] = useState<any>(null);

  console.log("CurrencySelector - value:", value);
  console.log("CurrencySelector - options:", options);
  console.log("CurrencySelector - countries count:", countries.length);

  // Find the selected country by currency code
  useEffect(() => {
    if (countries && countries.length > 0) {
      const country = countries.find(country => country.currency === value);
      setSelectedCountry(country);
      console.log("Selected country for currency", value, ":", country || "Not found");
    } else {
      console.log("No countries available to find currency", value);
    }
  }, [value, countries]);

  // Generate dropdown options from available currencies
  const renderCurrencyOptions = () => {
    if (isLoading) {
      return <div className="text-center p-4">Loading currencies...</div>;
    }
    
    if (!options || options.length === 0) {
      // If no options are passed, use all available currencies from countries that are enabled
      const availableCurrencies = Array.from(new Set(
        countries
          .filter(c => label.includes("Source") ? c.isSendingEnabled : c.isReceivingEnabled)
          .map(c => c.currency)
      ));
      
      console.log(`Generated ${availableCurrencies.length} currencies for ${label} dropdown`);
      
      if (availableCurrencies.length === 0) {
        return <div className="text-center p-4">No currencies available</div>;
      }
      
      return availableCurrencies.map((currency) => renderCurrencyOption(currency));
    }
    
    return options.map((option) => renderCurrencyOption(option));
  };

  // Render a single currency option with country information
  const renderCurrencyOption = (currency: string) => {
    const country = countries.find(c => c.currency === currency);
    
    return (
      <button
        key={currency}
        type="button"
        className="block w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center"
        onClick={() => {
          onChange(currency);
          setShowDropdown(false);
        }}
      >
        {country ? (
          <>
            <img 
              src={country.flagUrl || `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`}
              alt={`${country.name} flag`}
              className="w-5 h-3 object-cover rounded mr-2"
            />
            <div>
              <span className="font-medium">{currency}</span>
              <span className="text-xs text-gray-500 ml-2">({country.name})</span>
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

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center bg-primary-50 rounded-lg px-4 py-2 w-full justify-between"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {selectedCountry ? (
          <div className="flex items-center">
            <img 
              src={selectedCountry.flagUrl || `https://flagcdn.com/w80/${selectedCountry.code.toLowerCase()}.png`}
              alt={`${selectedCountry.name} flag`}
              className="w-5 h-3 object-cover rounded mr-2"
            />
            <span className="font-medium mr-1">{value}</span>
            <span className="text-xs text-gray-500">({selectedCountry.name})</span>
          </div>
        ) : (
          <div className="flex items-center">
            <Flag className="w-4 h-4 mr-2 text-gray-500" />
            <span className="font-medium">{value}</span>
          </div>
        )}
        <ChevronDown className="ml-2 h-4 w-4" />
      </button>
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-hidden">
          <div className="overflow-y-auto max-h-[15rem] overscroll-contain">
            {renderCurrencyOptions()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
