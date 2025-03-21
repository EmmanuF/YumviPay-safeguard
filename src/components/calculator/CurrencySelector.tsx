
import React, { useState, useEffect } from 'react';
import { ChevronDown, Flag } from 'lucide-react';
import { useCountries } from '@/hooks/useCountries';

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
  type?: 'source' | 'target'; // Added type prop to determine sending vs receiving
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  value, 
  onChange, 
  options, 
  label,
  type = 'source' // Default to source currency
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { countries, getSendingCountries, getReceivingCountries } = useCountries();
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [countryByCurrency, setCountryByCurrency] = useState<Record<string, any>>({});

  // Find the appropriate country by currency code based on sending/receiving status
  useEffect(() => {
    const loadCountriesByCurrency = async () => {
      const currencyMap: Record<string, any> = {};
      
      // Use the appropriate country list based on type
      let countryList = countries;
      if (type === 'source') {
        const sendingCountries = await getSendingCountries();
        if (sendingCountries && sendingCountries.length > 0) {
          countryList = sendingCountries;
        }
      } else if (type === 'target') {
        const receivingCountries = await getReceivingCountries();
        if (receivingCountries && receivingCountries.length > 0) {
          countryList = receivingCountries;
        }
      }
      
      // Build a map of currency code to country
      countryList.forEach(country => {
        // Prioritize sending countries for source currencies
        if (type === 'source' && country.isSendingEnabled) {
          currencyMap[country.currency] = country;
        } 
        // Prioritize receiving countries for target currencies
        else if (type === 'target' && country.isReceivingEnabled) {
          currencyMap[country.currency] = country;
        }
        // Fallback - if the currency isn't mapped yet, use this country
        else if (!currencyMap[country.currency]) {
          currencyMap[country.currency] = country;
        }
      });
      
      setCountryByCurrency(currencyMap);
      
      // Update selected country based on current value
      if (value && currencyMap[value]) {
        setSelectedCountry(currencyMap[value]);
      } else {
        setSelectedCountry(null);
      }
    };
    
    loadCountriesByCurrency();
  }, [countries, value, type, getSendingCountries, getReceivingCountries]);

  // Log for debugging
  useEffect(() => {
    if (options.length > 0) {
      console.log(`${label} options:`, options);
    }
  }, [options, label]);

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center bg-primary-50 rounded-lg px-4 py-2"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {selectedCountry ? (
          <div className="flex items-center">
            <img 
              src={selectedCountry.flagUrl}
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
            {options.length === 0 ? (
              <div className="px-4 py-2 text-gray-500">No options available</div>
            ) : (
              options.map((option) => {
                const country = countryByCurrency[option];
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
            {/* Add an empty div with padding to create extra space at the bottom */}
            <div className="h-4"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
