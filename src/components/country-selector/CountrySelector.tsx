
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useCountries } from '@/hooks/useCountries';
import SelectedCountry from './SelectedCountry';
import CountryDropdown from './CountryDropdown';

interface CountrySelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type: 'send' | 'receive';
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ 
  label, 
  value, 
  onChange,
  type
}) => {
  console.log(`🔄 CountrySelector - Rendering with type: "${type}", value: "${value}"`);
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { countries, isLoading } = useCountries();
  
  // Filter countries based on type (send/receive) and search term
  const filteredCountries = countries
    ?.filter(country => {
      const isEligible = type === 'receive' ? country.isReceivingEnabled : country.isSendingEnabled;
      return isEligible;
    })
    .filter(country => 
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase()));
  
  console.log(`📊 CountrySelector - ${type} filtered countries count:`, filteredCountries?.length || 0);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (countryCode: string) => {
    console.log(`🖱️ Country selected: ${countryCode}`);
    onChange(countryCode);
    setIsOpen(false);
    setSearchTerm('');
  };

  const selectedCountry = countries?.find(country => country.code === value);
  console.log(`🔍 CountrySelector - Selected country:`, selectedCountry);
  
  return (
    <div className="w-full mb-4" data-dropdown>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <div className="relative">
        <SelectedCountry 
          country={selectedCountry || null}
          onClick={() => setIsOpen(!isOpen)}
        />
        
        <AnimatePresence>
          {isOpen && (
            <CountryDropdown 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filteredCountries={filteredCountries || []}
              selectedValue={value}
              onSelect={handleCountrySelect}
              type={type}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CountrySelector;
