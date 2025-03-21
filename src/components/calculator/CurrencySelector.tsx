
import React, { useState, useEffect } from 'react';
import { ChevronDown, Flag } from 'lucide-react';
import { useCountries } from '@/hooks/useCountries';

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ value, onChange, options, label }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { countries } = useCountries();
  
  // Debug countries and currency mapping
  useEffect(() => {
    if (countries.length > 0 && options.length > 0) {
      console.log(`CurrencySelector (${label}): ${options.length} options available`);
      
      // Check if we can find countries for each currency
      const currencyMap = new Map();
      options.forEach(currencyCode => {
        const country = countries.find(c => c.currency === currencyCode);
        currencyMap.set(currencyCode, country ? country.name : null);
      });
      
      console.log(`CurrencySelector (${label}): Currency to country mapping:`, 
        Object.fromEntries(currencyMap.entries()));
      
      // Check specifically for the selected currency
      const selectedCountry = countries.find(c => c.currency === value);
      console.log(`CurrencySelector (${label}): Selected currency ${value} maps to:`, 
        selectedCountry ? `${selectedCountry.name} (flag: ${selectedCountry.flagUrl})` : 'Not found');
    }
  }, [countries, options, value, label]);

  // Find the selected country by currency code - improved version
  const getCountryByCurrency = (currencyCode: string) => {
    if (!currencyCode || !countries || countries.length === 0) return null;
    
    // Try to find exact match first
    const exactMatch = countries.find(country => country.currency === currencyCode);
    if (exactMatch) return exactMatch;
    
    // If no exact match, try case-insensitive match as fallback
    return countries.find(country => 
      country.currency.toLowerCase() === currencyCode.toLowerCase());
  };

  const selectedCountry = getCountryByCurrency(value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-currency-selector]')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" data-currency-selector>
      <button
        type="button"
        className="flex items-center bg-primary-50 rounded-lg px-4 py-2"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {value && selectedCountry ? (
          <div className="flex items-center">
            <img 
              src={selectedCountry.flagUrl} 
              alt={`${selectedCountry.name} flag`}
              className="w-5 h-3 object-cover rounded mr-2"
              onError={(e) => {
                // Fallback if image fails to load
                console.log(`Flag not found for ${selectedCountry.name} (${value})`);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="font-medium mr-1">{value}</span>
            <span className="text-xs text-gray-500 hidden sm:inline">({selectedCountry.name})</span>
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
            {options.length === 0 ? (
              <div className="px-4 py-2 text-gray-500">No options available</div>
            ) : (
              options.map((option) => {
                const country = getCountryByCurrency(option);
                return (
                  <button
                    key={option}
                    type="button"
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center"
                    onClick={() => {
                      onChange(option);
                      setShowDropdown(false);
                    }}
                  >
                    {country ? (
                      <>
                        <img 
                          src={country.flagUrl}
                          alt={`${country.name} flag`}
                          className="w-5 h-3 object-cover rounded mr-2"
                          onError={(e) => {
                            // Fallback if image fails to load
                            console.log(`Flag not found for ${country.name} (${option})`);
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div>
                          <span className="font-medium">{option}</span>
                          <span className="text-xs text-gray-500 ml-2">({country.name})</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Flag className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{option}</span>
                      </>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
