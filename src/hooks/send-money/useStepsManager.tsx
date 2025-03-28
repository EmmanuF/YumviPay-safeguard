
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
    console.log('🔄 Moving to next step from:', currentStep);
    switch (currentStep) {
      case 'recipient':
        console.log('✅ Next step is payment');
        return 'payment';
      case 'payment':
        console.log('✅ Next step is confirmation');
        return 'confirmation';
      case 'confirmation':
        console.log('✅ Next step is complete');
        return 'complete';
      default:
        console.log('❌ No next step defined for:', currentStep);
        return null;
    }
  };

  const moveToPreviousStep = (currentStep: SendMoneyStep): SendMoneyStep | null => {
    console.log('🔄 Moving to previous step from:', currentStep);
    switch (currentStep) {
      case 'payment':
        console.log('✅ Previous step is recipient');
        return 'recipient';
      case 'confirmation':
        console.log('✅ Previous step is payment');
        return 'payment';
      default:
        console.log('❌ No previous step defined for:', currentStep);
        return null;
    }
  };

  // Add a direct method to execute the step transition with validation
  const goToNextStep = () => {
    console.log('🔄 Attempting to go to next step from:', currentStep);
    const nextStep = moveToNextStep(currentStep);
    if (nextStep) {
      console.log('✅ Setting current step to:', nextStep);
      setCurrentStep(nextStep);
      return true;
    }
    console.log('❌ Failed to go to next step');
    return false;
  };

  // Add a direct method to go back
  const goToPreviousStep = () => {
    console.log('🔄 Attempting to go to previous step from:', currentStep);
    const prevStep = moveToPreviousStep(currentStep);
    if (prevStep) {
      console.log('✅ Setting current step to:', prevStep);
      setCurrentStep(prevStep);
      return true;
    } else if (currentStep === 'recipient') {
      // If we're at the first step, navigate back to home
      console.log('✅ At first step, navigating to home');
      navigate('/');
      return true;
    }
    console.log('❌ Failed to go to previous step');
    return false;
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
    goToNextStep,
    goToPreviousStep,
    navigate
  };
};
