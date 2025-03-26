
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Sun, Moon, MapPin } from 'lucide-react';

type GreetingType = {
  message: string;
  icon: React.ReactNode;
};

const TimeLocationGreeting: React.FC = () => {
  const [greeting, setGreeting] = useState<GreetingType>({
    message: "Hello",
    icon: <Sun className="w-4 h-4 text-amber-400" />
  });
  
  // Simulated location data - would be replaced with actual geolocation in a real app
  const [location, setLocation] = useState("Toronto 🇨🇦");
  
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
    
    // In a real app, we would get the location using geolocation API
    // For demonstration, we'll rotate through some locations
    const locations = ["Toronto 🇨🇦", "Cameroon 🇨🇲", "New York 🇺🇸", "London 🇬🇧"];
    const randomIndex = Math.floor(Math.random() * locations.length);
    setLocation(locations[randomIndex]);
  }, []);
  
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
