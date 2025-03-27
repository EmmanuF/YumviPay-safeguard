
import React from 'react';
import { motion } from 'framer-motion';
import { useCountries } from '@/hooks/useCountries';
import CountryOption from './CountryOption';
import SearchInput from './SearchInput';

interface CountryDropdownProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filteredCountries: Array<{
    code: string;
    name: string;
    flagUrl: string;
    isReceivingEnabled?: boolean;
    isSendingEnabled?: boolean;
  }>;
  selectedValue: string;
  onSelect: (countryCode: string) => void;
  type: 'send' | 'receive';
}

const CountryDropdown: React.FC<CountryDropdownProps> = ({
  searchTerm,
  setSearchTerm,
  filteredCountries,
  selectedValue,
  onSelect,
  type
}) => {
  const { isLoading } = useCountries();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute z-[100] mt-1 w-full rounded-xl bg-white border border-gray-200 
                 shadow-lg overflow-hidden"
      style={{ position: 'absolute', zIndex: 100 }} 
    >
      <div className="sticky top-0 bg-white p-2 border-b border-gray-100 z-10">
        <SearchInput 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
      </div>
      
      <div className="overflow-y-auto max-h-80 overscroll-contain">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading countries...</div>
        ) : filteredCountries?.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No countries found</div>
        ) : (
          filteredCountries?.map((country) => (
            <CountryOption
              key={country.code}
              country={country}
              isSelected={selectedValue === country.code}
              onClick={() => onSelect(country.code)}
            />
          ))
        )}
      </div>
    </motion.div>
  );
};

export default CountryDropdown;
