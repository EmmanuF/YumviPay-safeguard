
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, X } from 'lucide-react';
import { useCountries } from '@/hooks/useCountries';

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
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="glass-effect w-full flex items-center justify-between px-4 py-3 rounded-xl 
                     text-left focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
        >
          {value && selectedCountry ? (
            <div className="flex items-center">
              <img 
                src={selectedCountry.flagUrl} 
                alt={selectedCountry.name} 
                className="w-6 h-4 object-cover rounded mr-2"
                onError={(e) => {
                  console.error(`❌ Selected country flag load error:`, e);
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x30?text=?';
                }}
              />
              <span>{selectedCountry.name}</span>
            </div>
          ) : (
            <span className="text-gray-500">Select a country</span>
          )}
          <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 
                                 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 mt-1 w-full rounded-xl glass-effect border border-gray-200 
                         shadow-lg max-h-60 overflow-hidden"
            >
              <div className="sticky top-0 bg-white/90 backdrop-blur-sm p-2 border-b border-gray-100 z-10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-200 
                              focus:outline-none focus:ring-2 focus:ring-primary-300 text-sm"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="overflow-y-auto max-h-[15rem] overscroll-contain">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading countries...</div>
                ) : filteredCountries?.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No countries found</div>
                ) : (
                  filteredCountries?.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => handleCountrySelect(country.code)}
                      className={`w-full flex items-center px-4 py-2 text-left hover:bg-primary-50 
                                transition-colors ${value === country.code ? 'bg-primary-50' : ''}`}
                    >
                      <img 
                        src={country.flagUrl} 
                        alt={country.name} 
                        className="w-6 h-4 object-cover rounded mr-2"
                        onError={(e) => {
                          console.error(`❌ Country list flag load error for ${country.code}:`, e);
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x30?text=?';
                        }}
                      />
                      <span>{country.name}</span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CountrySelector;
