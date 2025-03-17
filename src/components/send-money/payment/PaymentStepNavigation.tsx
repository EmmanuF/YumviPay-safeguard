
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface PaymentStepNavigationProps {
  onNext: () => void;
  onBack: () => void;
  isNextDisabled: boolean;
}

const PaymentStepNavigation: React.FC<PaymentStepNavigationProps> = ({
  onNext,
  onBack,
  isNextDisabled
}) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div variants={itemVariants} className="pt-4 flex space-x-3">
      <Button 
        variant="outline"
        onClick={onBack} 
        className="w-1/2" 
        size="lg"
      >
        Back
      </Button>
      <Button 
        onClick={onNext} 
        className="w-1/2" 
        size="lg"
        disabled={isNextDisabled}
      >
        Continue
      </Button>
    </motion.div>
  );
};

export default PaymentStepNavigation;
