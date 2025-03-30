
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Info, HelpCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

const CountryCoverage = () => {
  const countries = [
    { 
      name: "Cameroon", 
      flag: "🇨🇲", 
      featured: true, 
      methods: ["MTN Mobile Money", "Orange Money", "Express Union"],
      speed: "Within minutes",
      status: "available"
    },
    { 
      name: "Nigeria", 
      flag: "🇳🇬", 
      methods: ["Bank Transfer", "OPay", "Palmpay"],
      speed: "Same day",
      status: "coming-soon"
    },
    { 
      name: "Ghana", 
      flag: "🇬🇭", 
      methods: ["MTN Mobile Money", "Vodafone Cash"],
      speed: "Within minutes",
      status: "coming-soon"
    },
    { 
      name: "Kenya", 
      flag: "🇰🇪", 
      methods: ["M-Pesa", "Equity Bank"],
      speed: "Within minutes",
      status: "coming-soon"
    },
    { 
      name: "Uganda", 
      flag: "🇺🇬", 
      methods: ["MTN Mobile Money", "Airtel Money"],
      speed: "Within 1 hour",
      status: "coming-soon"
    },
    { 
      name: "Tanzania", 
      flag: "🇹🇿", 
      methods: ["TIGO Pesa", "M-Pesa"],
      speed: "Within 1 hour",
      status: "coming-soon"
    },
    { 
      name: "South Africa", 
      flag: "🇿🇦", 
      methods: ["Bank Transfer", "eWallet"],
      speed: "Same day",
      status: "coming-soon"
    },
    { 
      name: "Ethiopia", 
      flag: "🇪🇹", 
      methods: ["CBE Birr", "Amole"],
      speed: "Same day",
      status: "planned"
    },
    { 
      name: "Rwanda", 
      flag: "🇷🇼", 
      methods: ["MTN Mobile Money", "Bank Transfer"],
      speed: "Within 1 hour",
      status: "planned"
    },
    { 
      name: "Senegal", 
      flag: "🇸🇳", 
      methods: ["Orange Money", "Wave"],
      speed: "Same day",
      status: "planned"
    },
    { 
      name: "Côte d'Ivoire", 
      flag: "🇨🇮", 
      methods: ["Orange Money", "MTN Mobile Money"],
      speed: "Same day",
      status: "planned"
    },
    { 
      name: "Mali", 
      flag: "🇲🇱", 
      methods: ["Orange Money", "Moov Money"],
      speed: "Same day", 
      status: "planned"
    }
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'available':
        return null;
      case 'coming-soon':
        return (
          <motion.span 
            className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs px-2 py-1 rounded-full font-bold z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1.1, 1],
              opacity: 1
            }}
            transition={{ 
              duration: 0.6,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 2
            }}
          >
            Coming Soon!
          </motion.span>
        );
      case 'planned':
        return (
          <motion.span 
            className="absolute -top-2 -right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium z-10"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            Planned
          </motion.span>
        );
      default:
        return null;
    }
  };

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
        
        <TooltipProvider>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {countries.map((country) => (
              <motion.div 
                key={country.name}
                className={`glass-effect rounded-xl p-4 text-center relative ${country.featured ? 'ring-2 ring-primary-300 bg-secondary-50' : ''}`}
                whileHover={{ 
                  y: -8, 
                  scale: 1.03,
                  transition: { type: "spring", stiffness: 300, damping: 20 } 
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20 
                }}
              >
                {getStatusBadge(country.status)}
                
                <motion.div 
                  className="text-3xl mb-2"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {country.flag}
                </motion.div>
                
                <p className="font-medium">{country.name}</p>
                
                {country.featured && (
                  <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full mt-2 inline-block">
                    Featured
                  </span>
                )}
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="absolute top-2 right-2 text-gray-400 hover:text-primary-500">
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="backdrop-blur-sm bg-white/95 border border-gray-200 p-3 max-w-[220px] shadow-lg rounded-lg">
                    <div className="space-y-2">
                      <p className="font-medium text-sm">{country.name}</p>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Payment Methods:</span>
                        <ul className="text-xs list-disc pl-4 mt-1">
                          {country.methods.map((method, i) => (
                            <li key={i}>{method}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="font-medium text-gray-500">Speed:</span>
                        <span>{country.speed}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="font-medium text-gray-500">Status:</span>
                        <span className={`capitalize ${
                          country.status === 'available' ? 'text-green-600' :
                          country.status === 'coming-soon' ? 'text-amber-600' : 'text-blue-600'
                        }`}>
                          {country.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            ))}
          </div>
        </TooltipProvider>
        
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">And more countries coming soon!</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CountryCoverage;
