
import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const CountryCoverage = () => {
  const countries = [
    { name: "Cameroon", flag: "🇨🇲", featured: true },
    { name: "Nigeria", flag: "🇳🇬" },
    { name: "Ghana", flag: "🇬🇭" },
    { name: "Kenya", flag: "🇰🇪" },
    { name: "Uganda", flag: "🇺🇬" },
    { name: "Tanzania", flag: "🇹🇿" },
    { name: "South Africa", flag: "🇿🇦" },
    { name: "Ethiopia", flag: "🇪🇹" },
    { name: "Rwanda", flag: "🇷🇼" },
    { name: "Senegal", flag: "🇸🇳" },
    { name: "Côte d'Ivoire", flag: "🇨🇮" },
    { name: "Mali", flag: "🇲🇱" }
  ];

  return (
    <motion.div 
      className="my-20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <Globe className="h-6 w-6 text-primary-500" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Send Money Across Africa</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We support transfers to multiple African countries, with more being added regularly
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {countries.map((country) => (
            <motion.div 
              key={country.name}
              className={`glass-effect rounded-xl p-4 text-center ${country.featured ? 'ring-2 ring-primary-300 bg-primary-50' : ''}`}
              whileHover={{ y: -5, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="text-3xl mb-2">{country.flag}</div>
              <p className="font-medium">{country.name}</p>
              {country.featured && (
                <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full mt-2 inline-block">
                  Featured
                </span>
              )}
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">And more countries coming soon!</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CountryCoverage;
