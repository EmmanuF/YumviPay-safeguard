
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export type SendMoneyStep = 'recipient' | 'payment' | 'confirmation';

interface SendMoneyStepNavigationProps {
  currentStep: SendMoneyStep;
  onNext: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
  isNextDisabled?: boolean;
}

const SendMoneyStepNavigation: React.FC<SendMoneyStepNavigationProps> = ({
  currentStep,
  onNext,
  onBack,
  isSubmitting = false,
  isNextDisabled = false,
}) => {
  return (
    <div className="pt-4 flex space-x-3">
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
        {isSubmitting && currentStep === 'confirmation' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing
          </>
        ) : (
          'Continue'
        )}
      </Button>
    </div>
  );
};

export default SendMoneyStepNavigation;
