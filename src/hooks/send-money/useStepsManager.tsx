
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export type SendMoneyStep = 'recipient' | 'payment' | 'confirmation' | 'complete';

export const useStepsManager = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<SendMoneyStep>('recipient');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    console.log('📊 Send Money Step:', currentStep, 'Submitting:', isSubmitting, 'Error:', error);
  }, [currentStep, isSubmitting, error]);

  const clearError = () => {
    if (error) {
      setError(null);
    }
  };

  const moveToNextStep = (currentStep: SendMoneyStep): SendMoneyStep | null => {
    switch (currentStep) {
      case 'recipient':
        return 'payment';
      case 'payment':
        return 'confirmation';
      case 'confirmation':
        return 'complete';
      default:
        return null;
    }
  };

  const moveToPreviousStep = (currentStep: SendMoneyStep): SendMoneyStep | null => {
    switch (currentStep) {
      case 'payment':
        return 'recipient';
      case 'confirmation':
        return 'payment';
      default:
        return null;
    }
  };

  return {
    currentStep,
    setCurrentStep,
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    clearError,
    retryCount,
    setRetryCount,
    moveToNextStep,
    moveToPreviousStep,
    navigate
  };
};
