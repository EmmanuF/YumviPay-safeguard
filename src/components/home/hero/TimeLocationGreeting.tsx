
import React, { useState, useEffect } from 'react';

const TimeLocationGreeting: React.FC = () => {
  const [greeting, setGreeting] = useState('');
  const [location, setLocation] = useState('United States');
  const [flag, setFlag] = useState('🇺🇸');
  
  useEffect(() => {
    // Get time-based greeting
    const getCurrentGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    };
    
    // Set initial greeting
    setGreeting(getCurrentGreeting());
    
    // Update greeting based on time changes
    const intervalId = setInterval(() => {
      setGreeting(getCurrentGreeting());
    }, 60000); // Update every minute
    
    // Get user location (simplified mock version for demo)
    // This would be replaced with actual geolocation API in production
    const getUserLocation = () => {
      // Mock location logic - would be replaced with actual geolocation
      // For demo, just use a fixed location
      setLocation('United States');
      setFlag('🇺🇸');
      
      // This is where a real location API would be used
      // navigator.geolocation.getCurrentPosition(position => {
      //   // Use position to fetch location name through reverse geocoding
      // });
    };
    
    getUserLocation();
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="text-gray-800 flex items-center justify-center space-x-1">
      <span className="text-lg font-medium">{greeting}</span>
      <span className="text-lg">from</span>
      <span className="font-semibold text-lg text-primary-600 flex items-center">
        {location} <span className="ml-1.5 text-xl">{flag}</span>
      </span>
    </div>
  );
};

export default TimeLocationGreeting;
