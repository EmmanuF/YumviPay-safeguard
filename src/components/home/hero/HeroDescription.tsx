
import React from 'react';
import { motion } from 'framer-motion';
import { HeroCalculator } from './index';
import TimeLocationGreeting from './TimeLocationGreeting';
import PersonalizedWelcome from './PersonalizedWelcome';

const HeroDescription: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Greeting section at top of calculator as a banner */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-3 mb-4 border border-gray-100">
        <div className="flex flex-col space-y-1">
          <TimeLocationGreeting />
          <PersonalizedWelcome />
        </div>
      </div>

      <HeroCalculator />
      
      {/* Trusted by section - moved to middle of page after calculator */}
      <div className="my-6 flex items-center justify-center">
        <div className="flex">
          <img 
            src="https://randomuser.me/api/portraits/men/25.jpg" 
            alt="User" 
            className="w-10 h-10 rounded-full border-2 border-white shadow-md"
          />
          <img 
            src="https://randomuser.me/api/portraits/women/67.jpg" 
            alt="User" 
            className="w-10 h-10 rounded-full border-2 border-white shadow-md -ml-2"
          />
          <img 
            src="https://randomuser.me/api/portraits/women/90.jpg" 
            alt="User" 
            className="w-10 h-10 rounded-full border-2 border-white shadow-md -ml-2"
          />
        </div>
        <div className="ml-3">
          <div className="text-sm text-gray-500">Trusted by</div>
          <div className="text-sm font-semibold">10K+ users globally</div>
        </div>
        
        <motion.div 
          className="ml-4 bg-white/80 px-3 py-1 rounded-full shadow-sm flex items-center"
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <div className="flex items-center">
            <span className="text-amber-500">★</span>
            <span className="text-amber-500">★</span>
            <span className="text-amber-500">★</span>
            <span className="text-amber-500">★</span>
            <span className="text-amber-500">★</span>
          </div>
          <span className="text-xs font-medium ml-1">4.9/5</span>
        </motion.div>
      </div>
      
      {/* Feature bullet points in a single horizontal line with flex-nowrap */}
      <div className="flex flex-nowrap justify-between items-center mt-4 space-x-2 overflow-x-auto">
        <div className="flex items-center gap-1 whitespace-nowrap">
          <div className="bg-green-100 p-1 rounded-full">
            <div className="text-green-600">✓</div>
          </div>
          <p className="text-sm text-gray-600">Fast transfers to 10+ African countries</p>
        </div>
        
        <div className="flex items-center gap-1 whitespace-nowrap">
          <div className="bg-green-100 p-1 rounded-full">
            <div className="text-green-600">✓</div>
          </div>
          <p className="text-sm text-gray-600"><strong>100% FREE</strong> - No transaction fees ever</p>
        </div>
        
        <div className="flex items-center gap-1 whitespace-nowrap">
          <div className="bg-green-100 p-1 rounded-full">
            <div className="text-green-600">✓</div>
          </div>
          <p className="text-sm text-gray-600">No hidden fees or exchange rate markups</p>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroDescription;
