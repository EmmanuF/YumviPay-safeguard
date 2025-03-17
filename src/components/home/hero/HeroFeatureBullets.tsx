
import React from 'react';
import { motion } from 'framer-motion';

const HeroFeatureBullets: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-3 mb-8"
    >
      <div className="flex items-start gap-2">
        <div className="bg-green-100 p-1 rounded-full mt-0.5">
          <div className="text-green-600">✓</div>
        </div>
        <p className="text-sm text-gray-600">Fast transfers to 10+ African countries</p>
      </div>
      <div className="flex items-start gap-2">
        <div className="bg-green-100 p-1 rounded-full mt-0.5">
          <div className="text-green-600">✓</div>
        </div>
        <p className="text-sm text-gray-600"><strong>100% FREE</strong> - No transaction fees ever</p>
      </div>
      <div className="flex items-start gap-2">
        <div className="bg-green-100 p-1 rounded-full mt-0.5">
          <div className="text-green-600">✓</div>
        </div>
        <p className="text-sm text-gray-600">No hidden fees or exchange rate markups</p>
      </div>
    </motion.div>
  );
};

export default HeroFeatureBullets;
