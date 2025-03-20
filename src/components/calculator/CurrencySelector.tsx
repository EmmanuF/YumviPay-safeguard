import React, { useState, useEffect, useCallback } from 'react';
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
  const [localOptions, setLocalOptions] = useState<string[]>([]);
  
  // Ensure we always have valid options by adding fallbacks
  useEffect(() => {
    // Start with provided options
    let validOptions = Array.isArray(options) && options.length > 0 
      ? [...options] 
      : [];
    
    // If we're looking for source currencies and have no options, add default sending currencies
    if (validOptions.length === 0) {
      if (label.toLowerCase().includes('source') || label.toLowerCase().includes('from') || label.toLowerCase().includes('send')) {
        validOptions = ['USD', 'EUR', 'GBP', 'CAD', 'CHF', 'AUD'];
        console.log('Added default source currencies due to empty options');
      } 
      // If we're looking for target currencies and have no options, add default receiving currencies
      else if (label.toLowerCase().includes('target') || label.toLowerCase().includes('to') || label.toLowerCase().includes('receive')) {
        validOptions = ['XAF', 'NGN', 'GHS', 'KES', 'ZAR', 'UGX'];
        console.log('Added default target currencies due to empty options');
      }
    }
    
    // Make sure we have unique values only
    validOptions = [...new Set(validOptions)];
    
    setLocalOptions(validOptions);
    setHasValidOptions(validOptions.length > 0);
  }, [options, label]);
  
  // Ensure the current value is in options or use first option
  useEffect(() => {
    if (hasValidOptions && value && !localOptions.includes(value)) {
      // Value not found in options, set to first available option
      onChange(localOptions[0]);
      console.log(`Currency ${value} not found in options, defaulting to ${localOptions[0]}`);
    } else if (hasValidOptions && !value) {
      // No value set, initialize with first option
      onChange(localOptions[0]);
      console.log(`No currency value set, defaulting to ${localOptions[0]}`);
    }
  }, [hasValidOptions, localOptions, value, onChange]);

  // Memoize the function to prevent recreation on each render
  const getCountryByCurrency = useCallback((currencyCode: string) => {
    if (!currencyCode || !countries || countries.length === 0) {
      return null;
    }

    // For source currency selector, prioritize countries that have isSendingEnabled=true
    if (label.toLowerCase().includes('source') || label.toLowerCase().includes('from') || label.toLowerCase().includes('send')) {
      const sendingCountry = countries.find(country => 
        country.currency === currencyCode && country.isSendingEnabled);
      
      if (sendingCountry) {
        return sendingCountry;
      }
    } 
    // For target currency selector, prioritize countries that have isReceivingEnabled=true
    else if (label.toLowerCase().includes('target') || label.toLowerCase().includes('to') || label.toLowerCase().includes('receive')) {
      const receivingCountry = countries.find(country => 
        country.currency === currencyCode && country.isReceivingEnabled);
      
      if (receivingCountry) {
        return receivingCountry;
      }
    }
    
    // Fallback to any country with matching currency if we can't find one with the right flag
    return countries.find(country => country.currency === currencyCode);
  }, [countries, label]);

  // Verify if we have a valid value and options
  const displayValue = hasValidOptions && value ? value : (hasValidOptions ? localOptions[0] : '—');
  const selectedCountry = getCountryByCurrency(displayValue);

  // Prevent render if we have no options to show
  if (!hasValidOptions && localOptions.length === 0) {
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
        type="button" // Explicitly set type to prevent form submission
      >
        {selectedCountry ? (
          <div className="flex items-center">
            <img 
              src={selectedCountry.flagUrl}
              alt={`${selectedCountry.name} flag`}
              className="w-5 h-3 object-cover rounded mr-2"
              onError={(e) => {
                // Replace with a flag icon if image fails to load
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const icon = document.createElement('span');
                  icon.className = 'inline-flex mr-2';
                  icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-flag"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" x2="4" y1="22" y2="15"></line></svg>';
                  parent.insertBefore(icon, e.currentTarget);
                }
              }}
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
            {localOptions.map((option) => {
              const country = getCountryByCurrency(option);
              return (
                <button
                  key={option}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center"
                  onClick={() => {
                    onChange(option);
                    setShowDropdown(false);
                  }}
                  type="button" // Explicitly set type to prevent form submission
                >
                  {country ? (
                    <>
                      <img 
                        src={country.flagUrl}
                        alt={`${country.name} flag`}
                        className="w-5 h-3 object-cover rounded mr-2"
                        onError={(e) => {
                          // Replace with a flag icon if image fails to load
                          e.currentTarget.onerror = null;
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const icon = document.createElement('span');
                            icon.className = 'inline-flex mr-2';
                            icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-flag"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" x2="4" y1="22" y2="15"></line></svg>';
                            parent.insertBefore(icon, e.currentTarget);
                          }
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
