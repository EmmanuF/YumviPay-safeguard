
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PaymentStepNavigationProps {
  onNext: () => void;
  onBack: () => void;
  isNextDisabled: boolean;
  isSubmitting: boolean;
  nextLabel?: string;
}

const PaymentStepNavigation: React.FC<PaymentStepNavigationProps> = ({
  onNext,
  onBack,
  isNextDisabled,
  isSubmitting = false,
  nextLabel = 'Continue'
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
        disabled={isSubmitting}
      >
        Back
      </Button>
      <Button 
        onClick={onNext} 
        className="w-1/2" 
        size="lg"
        disabled={isSubmitting || isNextDisabled}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing
          </>
        ) : (
          nextLabel
        )}
      </Button>
    </motion.div>
  );
};

export default PaymentStepNavigation;
