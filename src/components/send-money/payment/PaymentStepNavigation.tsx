
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
  // Log navigation rendering
  console.log('Rendering PaymentStepNavigation', { 
    isNextDisabled, 
    isSubmitting,
    nextLabel
  });
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      <Button 
        variant="outline"
        onClick={onBack} 
        className="w-full" 
        size="lg"
        disabled={isSubmitting}
      >
        Back
      </Button>
      <Button 
        onClick={onNext} 
        className="w-full" 
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
    </div>
  );
};

export default PaymentStepNavigation;
