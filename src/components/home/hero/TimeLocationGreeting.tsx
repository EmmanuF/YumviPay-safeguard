
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
      className="flex items-center text-sm text-muted-foreground"
    >
      <div className="flex items-center gap-1.5 mr-1.5">
        {greeting.icon}
        <span>{greeting.message}</span>
      </div>
      <div className="flex items-center gap-1">
        <MapPin className="w-3.5 h-3.5" />
        <span>{location}</span>
      </div>
    </motion.div>
  );
};

export default TimeLocationGreeting;
