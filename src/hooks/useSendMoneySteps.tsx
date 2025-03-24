
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
  const { redirectToKadoAndReturn, isLoading: isKadoLoading, checkApiConnection } = useKado();
  const [currentStep, setCurrentStep] = useState<SendMoneyStep>('recipient');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  useEffect(() => {
    console.log('Send Money Step:', currentStep, 'Submitting:', isSubmitting, 'Error:', error);
  }, [currentStep, isSubmitting, error]);

  const clearError = () => {
    if (error) {
      setError(null);
    }
  };

  const validateApiConnection = async () => {
    try {
      const { connected } = await checkApiConnection();
      if (!connected) {
        throw new Error("Could not connect to payment provider");
      }
      return true;
    } catch (error) {
      console.error("API connection validation failed:", error);
      return false;
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
            // Check API connection before proceeding
            const isConnected = await validateApiConnection();
            if (!isConnected) {
              toast.error("Connection Error", {
                description: "Could not connect to payment provider. Please try again.",
              });
              throw new Error("API connection validation failed");
            }
            
            // Get transaction data from localStorage
            const pendingTransaction = localStorage.getItem('pendingTransaction');
            if (!pendingTransaction) {
              throw new Error('Transaction data not found');
            }
            
            const transactionData = JSON.parse(pendingTransaction);
            console.log('Transaction data retrieved:', transactionData);
            
            // Store the transaction with its ID before redirecting
            localStorage.setItem(`transaction_${transactionId}`, JSON.stringify({
              ...transactionData,
              transactionId,
              createdAt: new Date().toISOString(),
              status: 'pending'
            }));
            
            // Redirect to Kado for payment processing
            await redirectToKadoAndReturn({
              amount: transactionData.amount.toString(),
              recipientName: transactionData.recipientName || 'Recipient',
              recipientContact: transactionData.recipientContact || transactionData.recipient || '',
              country: transactionData.targetCountry || 'CM',
              paymentMethod: transactionData.paymentMethod || 'mobile_money',
              transactionId,
            });
            
            // Navigate won't be called here as redirectToKadoAndReturn will handle navigation
          } catch (error) {
            console.error('Error redirecting to Kado:', error);
            
            // Increment retry count and check if we should retry
            const newRetryCount = retryCount + 1;
            setRetryCount(newRetryCount);
            
            if (newRetryCount <= MAX_RETRIES) {
              toast.error("Connection Error", {
                description: `Retry ${newRetryCount}/${MAX_RETRIES}: Connecting to payment provider...`,
              });
              
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 1500));
              
              // Try again (recursively call handleNext)
              return handleNext();
            }
            
            toast.error("Redirection Error", {
              description: "Could not connect to payment provider after multiple attempts. Please try again later.",
            });
            
            // If retries exhausted, navigate to transaction page anyway
            navigate('/transaction/new', { 
              state: { 
                errorType: 'kado_connection_error',
                message: 'Failed to connect to payment provider after multiple attempts'
              }
            });
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
      setRetryCount(0); // Reset retry count when going back
      
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
