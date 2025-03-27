
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Info } from 'lucide-react';
import { CountrySelector } from '@/components/country-selector';

interface CountrySectionProps {
  selectedCountry: string;
  onCountryChange: (code: string) => void;
  getCountryName: (code: string) => string;
}

const CountrySection: React.FC<CountrySectionProps> = ({ 
  selectedCountry, 
  onCountryChange,
  getCountryName
}) => {
  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { 
          y: 0, 
          opacity: 1,
          transition: { type: 'spring', stiffness: 300, damping: 24 }
        }
      }}
      className="mb-6 bg-white backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100/80 relative z-20"
    >
      <div className="flex items-center mb-3">
        <Globe className="h-5 w-5 mr-2 text-primary" />
        <h3 className="text-primary-600 font-medium text-base">Recipient's Country</h3>
      </div>
      
      <div className="mt-2">
        <CountrySelector
          label="Select Country"
          value={selectedCountry}
          onChange={onCountryChange}
          type="receive"
        />
        <p className="text-xs text-gray-500 mt-2 flex items-center">
          <Info className="h-4 w-4 mr-1 text-primary-400" />
          Using {getCountryName(selectedCountry)} phone number format
        </p>
      </div>
    </motion.div>
  );
};

export default CountrySection;
