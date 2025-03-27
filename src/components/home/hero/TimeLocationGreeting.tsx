
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { countries } from '@/data/countries';

type GreetingType = {
  message: string;
  icon: React.ReactNode;
};

const TimeLocationGreeting: React.FC = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState<GreetingType>({
    message: "Hello from",
    icon: <Sun className="w-4 h-4 text-amber-400" />
  });
  
  // State for city and country separately for better control
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("Cameroon");
  const [countryFlag, setCountryFlag] = useState<string>("🇨🇲");
  
  useEffect(() => {
    // Get current hour to determine appropriate greeting
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      setGreeting({
        message: "Good morning from",
        icon: <Sun className="w-4 h-4 text-amber-400" />
      });
    } else if (hour >= 12 && hour < 18) {
      setGreeting({
        message: "Good afternoon from",
        icon: <Sun className="w-4 h-4 text-amber-500" />
      });
    } else {
      setGreeting({
        message: "Good evening from",
        icon: <Moon className="w-4 h-4 text-indigo-300" />
      });
    }
    
    // Set location data based on user profile or browser info
    if (user?.country) {
      // Find country data from our countries list
      const countryData = countries.find(c => c.code === user.country);
      
      if (countryData) {
        setCountry(countryData.name);
        
        // Use flag emoji mapping for consistent display
        const countryToFlag: Record<string, string> = {
          'CM': '🇨🇲',
          'US': '🇺🇸',
          'CA': '🇨🇦',
          'GB': '🇬🇧',
          'FR': '🇫🇷',
          'DE': '🇩🇪'
        };
        
        setCountryFlag(countryToFlag[countryData.code] || '');
      }
      
      // Set city if available in user profile
      if (user.city) {
        setCity(user.city);
      }
    } else {
      // As fallback, try to use browser geolocation API
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              // Use browser's language to guess location if geolocation API is not specific enough
              const browserLang = navigator.language || 'en';
              const countryCode = browserLang.split('-')[1] || 'CM'; // Default to Cameroon
              
              // Map country codes to names
              const countryMap: Record<string, string> = {
                'CM': 'Cameroon',
                'US': 'United States',
                'CA': 'Canada',
                'GB': 'United Kingdom',
                'FR': 'France',
                'DE': 'Germany'
              };
              
              // Map country codes to flag emojis
              const flagMap: Record<string, string> = {
                'CM': '🇨🇲',
                'US': '🇺🇸',
                'CA': '🇨🇦',
                'GB': '🇬🇧',
                'FR': '🇫🇷',
                'DE': '🇩🇪'
              };
              
              setCountry(countryMap[countryCode] || 'Cameroon');
              setCountryFlag(flagMap[countryCode] || '🇨🇲');
              
              // For demonstration, we could set a default city based on country
              // In a real app, you'd use a geolocation service API
              const cityMap: Record<string, string> = {
                'CM': 'Yaoundé',
                'US': 'New York',
                'CA': 'Toronto',
                'GB': 'London',
                'FR': 'Paris',
                'DE': 'Berlin'
              };
              
              setCity(cityMap[countryCode] || '');
            } catch (error) {
              console.log('Error getting location:', error);
              setCountry('Cameroon');
              setCountryFlag('🇨🇲');
            }
          },
          (error) => {
            console.log('Geolocation error:', error);
            setCountry('Cameroon');
            setCountryFlag('🇨🇲');
          }
        );
      } else {
        // Geolocation not supported, default to Cameroon (MVP focus)
        setCountry('Cameroon');
        setCountryFlag('🇨🇲');
      }
    }
  }, [user]);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center text-sm font-medium"
    >
      <motion.div 
        className="flex items-center gap-1.5 mr-2"
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          animate={{ 
            rotate: [0, 15, 0, -15, 0],
            scale: [1, 1.2, 1, 1.2, 1]
          }}
          transition={{ 
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1],
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="bg-amber-50 p-1.5 rounded-full"
        >
          {greeting.icon}
        </motion.div>
        <span className="font-medium text-gray-800 bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
          {greeting.message}
        </span>
      </motion.div>
      <motion.div 
        className="flex items-center gap-1.5"
        initial={{ x: 20 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
      >
        <motion.div
          animate={{ 
            y: [0, -3, 0, 3, 0],
          }}
          transition={{ 
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1],
            repeat: Infinity,
            repeatDelay: 2
          }}
          className="bg-primary-50 p-1.5 rounded-full"
        >
          <MapPin className="w-3.5 h-3.5 text-primary-500" />
        </motion.div>
        <span className="font-medium text-gray-800 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          {city && `${city}, `}{country} <span className="text-base inline-block ml-1" role="img" aria-label={`Flag of ${country}`}>{countryFlag}</span>
        </span>
      </motion.div>
    </motion.div>
  );
};

export default TimeLocationGreeting;
