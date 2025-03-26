
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

  // Enhanced logging to track button clicks
  const handleNextClick = () => {
    console.log("Next button clicked in PaymentStepNavigation, calling onNext()");
    onNext();
  };

  const handleBackClick = () => {
    console.log("Back button clicked in PaymentStepNavigation, calling onBack()");
    onBack();
  };

  return (
    <motion.div variants={itemVariants} className="w-full pt-6 flex gap-4 mb-20 mt-8 sticky bottom-0 z-10 bg-background">
      <Button 
        type="button"
        variant="outline"
        onClick={handleBackClick} 
        className="flex-1 border-secondary-300 h-14" 
        size="lg"
        disabled={isSubmitting}
      >
        Back
      </Button>
      <Button 
        type="button"
        onClick={handleNextClick} 
        className="flex-1 bg-primary hover:bg-primary-600 group h-14" 
        size="lg"
        disabled={isSubmitting || isNextDisabled}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default PaymentStepNavigation;
