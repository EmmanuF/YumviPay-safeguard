
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';

export type SendMoneyStep = 'recipient' | 'payment' | 'confirmation';

export const useSendMoneySteps = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [currentStep, setCurrentStep] = useState<SendMoneyStep>('recipient');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Send Money Step:', currentStep);
  }, [currentStep]);

  const handleNext = () => {
    try {
      console.log('Moving to next step from:', currentStep);
      
      switch (currentStep) {
        case 'recipient':
          setCurrentStep('payment');
          break;
        case 'payment':
          setCurrentStep('confirmation');
          break;
        case 'confirmation':
          setIsSubmitting(true);
          setTimeout(() => {
            setIsSubmitting(false);
            // Use Sonner toast for better visibility
            toast.success("Transaction Initiated", {
              description: "Your transaction has been initiated successfully.",
            });
            navigate('/transaction/new');
          }, 1000);
          break;
      }
    } catch (error) {
      console.error('Error in handleNext:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      toast.error("Error", {
        description: "There was a problem processing your request. Please try again.",
      });
    }
  };

  const handleBack = () => {
    try {
      console.log('Moving to previous step from:', currentStep);
      
      switch (currentStep) {
        case 'payment':
          setCurrentStep('recipient');
          break;
        case 'confirmation':
          setCurrentStep('payment');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Error in handleBack:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  return {
    currentStep,
    isSubmitting,
    error,
    handleNext,
    handleBack,
  };
};
