
import React from 'react';
import { motion } from 'framer-motion';
import { HeroCalculator } from './index';
import TimeLocationGreeting from './TimeLocationGreeting';
import PersonalizedWelcome from './PersonalizedWelcome';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const HeroDescription: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Greeting section moved to top of calculator as a banner */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-3 mb-4 border border-gray-100">
        <div className="flex flex-col space-y-1">
          <TimeLocationGreeting />
          <PersonalizedWelcome />
        </div>
      </div>

      {/* Calculator component first */}
      <HeroCalculator />

      {/* Trusted by section - moved below the calculator */}
      <div className="mt-4 mb-4 flex items-center">
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
      
      {/* Feature cards in a grid with different colors and animations */}
      <div className="grid grid-cols-2 gap-3 mt-6 mb-2">
        <motion.div
          whileHover={{ y: -4 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: 0.1, 
            type: "spring",
            stiffness: 300
          }}
        >
          <Card className="h-full border-0 bg-gradient-to-br from-primary-50 to-primary-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-start space-x-2">
              <CheckCircle2 className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium text-gray-700">Fast transfers to 10+ African countries</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: 0.2, 
            type: "spring",
            stiffness: 300
          }}
        >
          <Card className="h-full border-0 bg-gradient-to-br from-secondary-50 to-secondary-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-start space-x-2">
              <CheckCircle2 className="h-5 w-5 text-secondary-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium text-gray-700"><strong>100% FREE</strong> - No transaction fees ever</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: 0.3, 
            type: "spring",
            stiffness: 300
          }}
        >
          <Card className="h-full border-0 bg-gradient-to-br from-amber-50 to-amber-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-start space-x-2">
              <CheckCircle2 className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium text-gray-700">No hidden fees or exchange rate markups</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: 0.4, 
            type: "spring",
            stiffness: 300
          }}
        >
          <Card className="h-full border-0 bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-start space-x-2">
              <CheckCircle2 className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium text-gray-700">Easy mobile transfers with fast delivery</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroDescription;
