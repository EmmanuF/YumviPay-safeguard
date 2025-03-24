
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroActionsProps {
  onGetStarted: () => void;
}

const HeroActions: React.FC<HeroActionsProps> = ({ onGetStarted }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-wrap gap-4 mb-8"
    >
      <Button
        onClick={onGetStarted}
        className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl transition-all duration-300 text-base shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30"
        size="lg"
      >
        <motion.span
          className="flex items-center"
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </motion.span>
      </Button>
      
      <Button
        variant="outline"
        className="border-secondary-200 bg-secondary-500 text-white hover:bg-secondary-600 hover:border-secondary-300 shadow-sm"
        size="lg"
      >
        <motion.span
          className="flex items-center"
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <Download className="mr-2 h-5 w-5" />
          Download App
        </motion.span>
      </Button>
    </motion.div>
  );
};

export default HeroActions;
