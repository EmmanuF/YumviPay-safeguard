
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';

interface PaymentStepNavigationProps {
  onNext: () => void;
  onBack: () => void;
  isNextDisabled: boolean;
  isSubmitting: boolean;
}

const PaymentStepNavigation: React.FC<PaymentStepNavigationProps> = ({
  onNext,
  onBack,
  isNextDisabled,
  isSubmitting = false
}) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  // Make sure we don't prevent default behavior or stop propagation
  const handleNextClick = () => {
    console.log("Next button clicked in PaymentStepNavigation");
    onNext();
  };

  const handleBackClick = () => {
    console.log("Back button clicked in PaymentStepNavigation");
    onBack();
  };

  return (
    <motion.div variants={itemVariants} className="pt-4 flex space-x-3">
      <Button 
        type="button"
        variant="outline"
        onClick={handleBackClick} 
        className="w-1/2 border-secondary-300" 
        size="lg"
        disabled={isSubmitting}
      >
        Back
      </Button>
      <Button 
        type="button"
        onClick={handleNextClick} 
        className="w-1/2 bg-primary hover:bg-primary-600 group" 
        size="lg"
        disabled={isSubmitting || isNextDisabled}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default PaymentStepNavigation;
