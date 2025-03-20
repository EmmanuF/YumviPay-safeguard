
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
  const [hasValidOptions, setHasValidOptions] = useState(false);
  
  // Check if we have valid options
  useEffect(() => {
    if (options && options.length > 0) {
      setHasValidOptions(true);
    } else {
      setHasValidOptions(false);
    }
  }, [options]);

  // Ensure the current value is in options or use first option
  useEffect(() => {
    if (hasValidOptions && value && !options.includes(value)) {
      // Value not found in options, set to first available option
      onChange(options[0]);
    }
  }, [hasValidOptions, options, value, onChange]);

  // Verify if we have a valid value and options
  const displayValue = hasValidOptions && value ? value : (hasValidOptions ? options[0] : '—');
  
  // Debug available countries for this selector
  console.log(`CurrencySelector "${label}" rendering with ${options?.length || 0} options:`, options);

  // Find the selected country by currency code - prefer countries that match the sending/receiving pattern
  const getCountryByCurrency = (currencyCode: string) => {
    if (!currencyCode || !countries || countries.length === 0) {
      return null;
    }

    // For source currency selector, prioritize countries that have isSendingEnabled=true
    if (label.toLowerCase().includes('source') || label.toLowerCase().includes('from') || label.toLowerCase().includes('send')) {
      console.log(`Looking for sending country with currency ${currencyCode}`);
      const sendingCountry = countries.find(country => 
        country.currency === currencyCode && country.isSendingEnabled);
      
      if (sendingCountry) {
        console.log(`Found sending country for ${currencyCode}:`, sendingCountry.name);
        return sendingCountry;
      } else {
        console.log(`No sending country found for ${currencyCode}`);
      }
    } 
    // For target currency selector, prioritize countries that have isReceivingEnabled=true
    else if (label.toLowerCase().includes('target') || label.toLowerCase().includes('to') || label.toLowerCase().includes('receive')) {
      console.log(`Looking for receiving country with currency ${currencyCode}`);
      const receivingCountry = countries.find(country => 
        country.currency === currencyCode && country.isReceivingEnabled);
      
      if (receivingCountry) {
        console.log(`Found receiving country for ${currencyCode}:`, receivingCountry.name);
        return receivingCountry;
      } else {
        console.log(`No receiving country found for ${currencyCode}`);
      }
    }
    
    // Fallback to any country with matching currency if we can't find one with the right flag
    console.log(`Falling back to any country with currency ${currencyCode}`);
    const anyCountry = countries.find(country => country.currency === currencyCode);
    if (anyCountry) {
      console.log(`Found fallback country for ${currencyCode}:`, anyCountry.name);
    } else {
      console.log(`No fallback country found for ${currencyCode}`);
    }
    return anyCountry;
  };

  const selectedCountry = getCountryByCurrency(displayValue);

  // Prevent render if we have no options to show
  if (!hasValidOptions && !options?.length) {
    return (
      <div className="bg-primary-50 rounded-lg px-4 py-2 flex items-center">
        <Flag className="w-4 h-4 mr-2 text-gray-500" />
        <span className="font-medium text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
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
            <span className="font-medium mr-1">{displayValue}</span>
            <span className="text-xs text-gray-500">({selectedCountry.name})</span>
          </div>
        ) : (
          <div className="flex items-center">
            <Flag className="w-4 h-4 mr-2 text-gray-500" />
            <span className="font-medium">{displayValue}</span>
          </div>
        )}
        <ChevronDown className="ml-2 h-4 w-4" />
      </button>
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-hidden">
          <div className="overflow-y-auto max-h-[15rem] overscroll-contain">
            {options.map((option) => {
              const country = getCountryByCurrency(option);
              return (
                <button
                  key={option}
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
            })}
            {/* Add an empty div with padding to create extra space at the bottom */}
            <div className="h-4"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
