
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
  console.log('[PaymentStepNavigation] Props received:', { 
    isNextDisabled, 
    isSubmitting,
    onNext: typeof onNext, 
    onBack: typeof onBack 
  });
  
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('[PaymentStepNavigation] Next button clicked');
    if (typeof onNext === 'function') {
      console.log('[PaymentStepNavigation] Calling onNext function');
      onNext();
    } else {
      console.error('[PaymentStepNavigation] onNext is not a function!', onNext);
    }
  };
  
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('[PaymentStepNavigation] Back button clicked');
    if (typeof onBack === 'function') {
      console.log('[PaymentStepNavigation] Calling onBack function');
      onBack();
    } else {
      console.error('[PaymentStepNavigation] onBack is not a function!', onBack);
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
        type="button"
      >
        Back
      </Button>
      <Button 
        onClick={handleNext} 
        className="w-full" 
        size="lg"
        disabled={isSubmitting || isNextDisabled}
        type="button"
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
