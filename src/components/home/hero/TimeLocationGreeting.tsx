
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
  
  // Default to Cameroon as the MVP country focus or user's country if available
  const [location, setLocation] = useState("Cameroon 🇨🇲");
  
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
    
    // Try to get user's actual location
    // If user has a country code in their profile, use that
    if (user?.country) {
      // Format country code to country name and emoji
      let countryDisplay = user.country;
      
      // Add emoji based on country code
      if (user.country === 'CM') {
        countryDisplay = "Cameroon 🇨🇲";
      } else if (user.country === 'US') {
        countryDisplay = "United States 🇺🇸";
      } else if (user.country === 'CA') {
        countryDisplay = "Canada 🇨🇦";
      } else if (user.country === 'GB') {
        countryDisplay = "United Kingdom 🇬🇧";
      }
      
      setLocation(countryDisplay);
    } else {
      // As fallback, try to use browser geolocation API
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              // Use browser's language to guess location if geolocation API is not specific enough
              const browserLang = navigator.language || 'en';
              const countryCode = browserLang.split('-')[1] || 'CM'; // Default to Cameroon
              
              // Map country codes to names with emojis
              const countryMap: Record<string, string> = {
                'CM': 'Cameroon 🇨🇲',
                'US': 'United States 🇺🇸',
                'CA': 'Canada 🇨🇦',
                'GB': 'United Kingdom 🇬🇧',
                'FR': 'France 🇫🇷',
                'DE': 'Germany 🇩🇪'
              };
              
              setLocation(countryMap[countryCode] || 'Cameroon 🇨🇲');
            } catch (error) {
              console.log('Error getting location:', error);
              setLocation('Cameroon 🇨🇲'); // Default to Cameroon
            }
          },
          (error) => {
            console.log('Geolocation error:', error);
            setLocation('Cameroon 🇨🇲'); // Default to Cameroon
          }
        );
      } else {
        // Geolocation not supported, default to Cameroon (MVP focus)
        setLocation('Cameroon 🇨🇲');
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
          {location}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default TimeLocationGreeting;
