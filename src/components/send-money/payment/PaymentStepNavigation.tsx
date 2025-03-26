
import React from 'react';
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
  // Enhanced logging for debugging
  console.log('PaymentStepNavigation props:', { 
    isNextDisabled, 
    isSubmitting,
    onNext: typeof onNext, 
    onBack: typeof onBack 
  });
  
  // Debug handler wrappers
  const handleNext = () => {
    console.log('Next button clicked, calling onNext function');
    if (typeof onNext === 'function') {
      onNext();
    } else {
      console.error('onNext is not a function!', onNext);
    }
  };
  
  const handleBack = () => {
    console.log('Back button clicked, calling onBack function');
    if (typeof onBack === 'function') {
      onBack();
    } else {
      console.error('onBack is not a function!', onBack);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      <Button 
        variant="outline"
        onClick={handleBack} 
        className="w-full" 
        size="lg"
        disabled={isSubmitting}
      >
        Back
      </Button>
      <Button 
        onClick={handleNext} 
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
