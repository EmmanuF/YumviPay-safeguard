
import React, { useState, useEffect } from 'react';
import { useCountries } from '@/hooks/useCountries';
import SelectedCurrency from './SelectedCurrency';
import CurrencyDropdown from './CurrencyDropdown';

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
  const { countries } = useCountries();
  const [selectedCountry, setSelectedCountry] = useState<any>(null);

  console.log(`🔄 CurrencySelector - value: "${value}", label: "${label}"`);
  console.log(`📋 CurrencySelector - options:`, options);

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

  // Handle currency selection
  const handleCurrencySelect = (currency: string) => {
    onChange(currency);
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.currency-dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative currency-dropdown-container">
      <SelectedCurrency 
        currency={value}
        countryName={selectedCountry?.name}
        flagUrl={selectedCountry?.flagUrl || (selectedCountry?.code && 
          `https://flagcdn.com/w80/${selectedCountry.code.toLowerCase()}.png`)}
        onClick={() => setShowDropdown(!showDropdown)}
      />
      
      {showDropdown && (
        <CurrencyDropdown 
          options={options} 
          label={label} 
          onSelect={handleCurrencySelect} 
        />
      )}
    </div>
  );
};

export default CurrencySelector;
