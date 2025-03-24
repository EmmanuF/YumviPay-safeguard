
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';
import { useKado } from '@/services/kado/useKado';
import { generateTransactionId } from '@/utils/transactionUtils';

export type SendMoneyStep = 'recipient' | 'payment' | 'confirmation';

export const useSendMoneySteps = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const { redirectToKadoAndReturn, isLoading: isKadoLoading } = useKado();
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

  const handleNext = async () => {
    try {
      clearError();
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
          console.log('Submitting transaction...');
          
          // Generate a transaction ID for the current transaction
          const transactionId = generateTransactionId();
          
          try {
            // Get transaction data from localStorage
            const pendingTransaction = localStorage.getItem('pendingTransaction');
            if (!pendingTransaction) {
              throw new Error('Transaction data not found');
            }
            
            const transactionData = JSON.parse(pendingTransaction);
            console.log('Transaction data retrieved:', transactionData);
            
            // Redirect to Kado for payment processing
            await redirectToKadoAndReturn({
              amount: transactionData.amount.toString(),
              recipientName: transactionData.recipientName || 'Recipient',
              recipientContact: transactionData.recipientContact || '',
              country: transactionData.targetCountry || 'CM',
              paymentMethod: transactionData.paymentMethod || 'mobile_money',
              transactionId,
            });
            
            // Note: The navigate function won't be called here as redirectToKadoAndReturn 
            // will handle the navigation after the redirect completes
          } catch (error) {
            console.error('Error redirecting to Kado:', error);
            // Use Sonner toast for better visibility
            toast.error("Redirection Error", {
              description: "There was a problem connecting to the payment provider. Please try again.",
            });
            
            // If there's an error, navigate to the transaction page anyway
            // so the user doesn't get stuck
            navigate('/transaction/new');
          } finally {
            setIsSubmitting(false);
          }
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
          setCurrentStep('recipient');
          break;
        case 'confirmation':
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
    isSubmitting: isSubmitting || isKadoLoading,
    error,
    handleNext,
    handleBack,
  };
};
