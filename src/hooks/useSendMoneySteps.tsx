
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
    console.log('Send Money Step:', currentStep, 'Submitting:', isSubmitting, 'Error:', error);
  }, [currentStep, isSubmitting, error]);

  const clearError = () => {
    if (error) {
      setError(null);
    }
  };

  const handleNext = () => {
    try {
      clearError();
      console.log('Moving to next step from:', currentStep);
      
      switch (currentStep) {
        case 'recipient':
          console.log('Moving from recipient to payment step');
          setCurrentStep('payment');
          break;
        case 'payment':
          console.log('Moving from payment to confirmation step');
          setCurrentStep('confirmation');
          break;
        case 'confirmation':
          setIsSubmitting(true);
          console.log('Submitting transaction...');
          
          // Make sure transaction data is saved to localStorage before navigating
          const pendingTransaction = localStorage.getItem('processedPendingTransaction');
          if (!pendingTransaction) {
            console.error('No pending transaction data found');
            setError('Transaction data not found. Please try again.');
            setIsSubmitting(false);
            return;
          }
          
          console.log('Found transaction data, proceeding with submission');
          
          setTimeout(() => {
            setIsSubmitting(false);
            // Use Sonner toast for better visibility
            toast.success("Transaction Initiated", {
              description: "Your transaction has been initiated successfully.",
            });
            // Navigate to the new transaction page
            console.log('Navigation to transaction/new');
            navigate('/transaction/new');
          }, 1000);
          break;
        default:
          console.error('Unknown step:', currentStep);
      }
    } catch (error) {
      console.error('Error in handleNext:', error);
      setIsSubmitting(false);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      toast.error("Error", {
        description: "There was a problem processing your request. Please try again.",
      });
    }
  };

  const handleBack = () => {
    try {
      clearError();
      console.log('Moving to previous step from:', currentStep);
      
      switch (currentStep) {
        case 'payment':
          console.log('Moving back from payment to recipient step');
          setCurrentStep('recipient');
          break;
        case 'confirmation':
          console.log('Moving back from confirmation to payment step');
          setCurrentStep('payment');
          break;
        case 'recipient':
          console.log('Already at first step, navigating to home');
          navigate('/');
          break;
        default:
          console.error('Unknown step:', currentStep);
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
