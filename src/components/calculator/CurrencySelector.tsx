
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

  console.log(`🔄 CurrencySelector - value: "${value}", label: "${label}"`);
  console.log(`📋 CurrencySelector - options:`, options);
  console.log(`📊 CurrencySelector - countries count:`, countries.length);
  console.log(`📤 CurrencySelector - sending countries count:`, countries.filter(c => c.isSendingEnabled).length);

  // Find the selected country by currency code
  useEffect(() => {
    if (countries && countries.length > 0) {
      const country = countries.find(country => country.currency === value);
      setSelectedCountry(country);
      console.log(`🔍 Selected country for currency "${value}":`, country || "Not found");
      if (country) {
        console.log(`🏳️ Flag URL for selected country:`, country.flagUrl);
      } else {
        // If country not found, look for a hardcoded fallback
        const fallbackMap: {[key: string]: {code: string, name: string}} = {
          'USD': { code: 'us', name: 'United States' },
          'EUR': { code: 'eu', name: 'European Union' },
          'GBP': { code: 'gb', name: 'United Kingdom' },
          'XAF': { code: 'cm', name: 'Cameroon' },
          'NGN': { code: 'ng', name: 'Nigeria' },
          'KES': { code: 'ke', name: 'Kenya' }
        };
        
        if (fallbackMap[value]) {
          const fallback = fallbackMap[value];
          setSelectedCountry({
            name: fallback.name,
            code: fallback.code.toUpperCase(),
            currency: value,
            flagUrl: `https://flagcdn.com/w80/${fallback.code.toLowerCase()}.png`
          });
          console.log(`🔍 Using fallback country for currency "${value}":`, fallback.name);
        }
      }
    } else {
      console.log(`⚠️ No countries available to find currency "${value}"`);
    }
  }, [value, countries]);

  // Generate dropdown options from available currencies
  const renderCurrencyOptions = () => {
    if (isLoading) {
      console.log(`⏳ CurrencySelector - Loading currencies...`);
      return <div className="text-center p-4">Loading currencies...</div>;
    }
    
    // Determine which currencies to display based on source/target
    let availableCurrencies: string[] = [];
    
    if (options && options.length > 0) {
      availableCurrencies = options;
      console.log(`🔍 Using provided options for ${label} dropdown:`, availableCurrencies);
    } else {
      // If no options are passed, use all available currencies from countries that are enabled
      const filteredCountries = label.includes("Source") 
        ? countries.filter(c => c.isSendingEnabled) 
        : countries.filter(c => c.isReceivingEnabled);
      
      console.log(`📊 Filtered ${filteredCountries.length} countries for ${label}`);
      
      availableCurrencies = Array.from(new Set(
        filteredCountries.map(c => c.currency)
      ));
      
      console.log(`🔍 Generated ${availableCurrencies.length} currencies for ${label} dropdown`);
    }
    
    // If still no currencies available, add fallbacks
    if (availableCurrencies.length === 0) {
      console.log(`⚠️ No currencies available for ${label}, adding fallbacks`);
      
      if (label.includes("Source")) {
        availableCurrencies = ['USD', 'EUR', 'GBP'];
        console.log(`➕ Added fallback source currencies: ${availableCurrencies}`);
      } else {
        availableCurrencies = ['XAF', 'NGN', 'KES'];
        console.log(`➕ Added fallback target currencies: ${availableCurrencies}`);
      }
    }
    
    console.log(`📋 Final available currencies for ${label}:`, availableCurrencies);
    
    return availableCurrencies.map((currency) => renderCurrencyOption(currency));
  };

  // Render a single currency option with country information
  const renderCurrencyOption = (currency: string) => {
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
    
    // Use either the real country or a fallback
    let displayCountry: any;
    let flagUrl: string;
    
    if (country) {
      console.log(`🏳️ Currency option ${currency} - Found country: ${country.name} with flag: ${country.flagUrl}`);
      displayCountry = country;
      flagUrl = country.flagUrl || `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`;
    } else if (fallbackMap[currency]) {
      console.log(`⚠️ Currency option ${currency} - Using fallback country: ${fallbackMap[currency].name}`);
      displayCountry = {
        name: fallbackMap[currency].name,
        code: fallbackMap[currency].code.toUpperCase()
      };
      flagUrl = `https://flagcdn.com/w80/${fallbackMap[currency].code.toLowerCase()}.png`;
    } else {
      console.log(`⚠️ Currency option ${currency} - No country found, using generic`);
      displayCountry = { name: currency, code: 'XX' };
      flagUrl = 'https://via.placeholder.com/40x30?text=?';
    }
    
    return (
      <button
        key={currency}
        type="button"
        className="block w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center"
        onClick={() => {
          console.log(`🖱️ Currency selected: ${currency}`);
          onChange(currency);
          setShowDropdown(false);
        }}
      >
        {displayCountry ? (
          <>
            <img 
              src={flagUrl}
              alt={`${displayCountry.name} flag`}
              className="w-5 h-3 object-cover rounded mr-2"
              onError={(e) => {
                console.error(`❌ Flag image load error for ${displayCountry.code}:`, e);
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x30?text=?';
              }}
            />
            <div>
              <span className="font-medium">{currency}</span>
              <span className="text-xs text-gray-500 ml-2">({displayCountry.name})</span>
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
        className="flex items-center bg-white border border-gray-200 shadow-sm rounded-lg px-4 py-2 w-full justify-between hover:bg-gray-50 transition-all duration-200"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {selectedCountry ? (
          <div className="flex items-center">
            <img 
              src={selectedCountry.flagUrl || `https://flagcdn.com/w80/${selectedCountry.code.toLowerCase()}.png`}
              alt={`${selectedCountry.name} flag`}
              className="w-5 h-3 object-cover rounded mr-2"
              onError={(e) => {
                console.error(`❌ Selected flag image load error:`, e);
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x30?text=?';
              }}
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
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-hidden border border-gray-200">
          <div className="overflow-y-auto max-h-[15rem] overscroll-contain">
            {renderCurrencyOptions()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
