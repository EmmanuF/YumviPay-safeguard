
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
  const [selectedCountry, setSelectedCountry] = useState<any>(null);

  // Find the selected country by currency code
  const getCountryByCurrency = (currencyCode: string) => {
    return countries.find(country => country.currency === currencyCode);
  };

  // Update the selected country when value or countries change
  useEffect(() => {
    const country = getCountryByCurrency(value);
    setSelectedCountry(country);
  }, [value, countries]);

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
