
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface HeroActionsProps {
  onGetStarted: () => void;
}

const HeroActions: React.FC<HeroActionsProps> = ({ onGetStarted }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-wrap gap-4 justify-center mb-12"
    >
      <Button 
        size="lg" 
        onClick={onGetStarted}
        className="bg-primary hover:bg-primary/90 text-white px-8 py-6 h-auto text-base"
      >
        Start Sending <ArrowRight className="ml-2" size={18} />
      </Button>
      
      <Button 
        variant="secondary" 
        size="lg"
        className="bg-secondary-200/30 hover:bg-secondary-300/40 text-white border border-white/20 px-8 py-6 h-auto text-base"
      >
        Try Our App
      </Button>
    </motion.div>
  );
};

export default HeroActions;
