
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useKado } from '@/services/kado/useKado';
import { useStepsManager, SendMoneyStep } from './send-money/useStepsManager';
import { useStepValidation } from './send-money/useStepValidation';
import { useApiValidation } from './send-money/useApiValidation';
import { useRedirectHandler } from './send-money/useRedirectHandler';
import { createAndStoreTransaction } from './send-money/useTransactionDataManager';

export type { SendMoneyStep } from './send-money/useStepsManager';

export const useSendMoneySteps = () => {
  // Core hooks
  const { redirectToKadoAndReturn, isLoading: isKadoLoading, checkApiConnection } = useKado();
  const { validateApiConnection, isValidating } = useApiValidation();
  const { handleKadoRedirect, isRedirecting } = useRedirectHandler();
  const { validateRecipientStep, validatePaymentStep } = useStepValidation();
  
  // Steps management
  const {
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
  } = useStepsManager();

  // Constants
  const MAX_RETRIES = 2;

  const handleNext = async () => {
    try {
      clearError();
      console.log('📝 Moving to next step from:', currentStep);
      
      switch (currentStep) {
        case 'recipient':
          if (!validateRecipientStep(null)) return;
          
          console.log('✅ Transitioning to payment step');
          setCurrentStep('payment');
          break;
          
        case 'payment':
          if (!validatePaymentStep(null)) return;
          
          console.log('✅ Transitioning to confirmation step');
          setCurrentStep('confirmation');
          break;
          
        case 'confirmation':
          setIsSubmitting(true);
          console.log('🚀 Submitting transaction...');
          
          try {
            const isConnected = await validateApiConnection(checkApiConnection);
            if (!isConnected) {
              toast.error("Connection Error", {
                description: "Could not connect to payment provider. Please try again.",
              });
              throw new Error("API connection validation failed");
            }
            
            const pendingTransaction = localStorage.getItem('pendingTransaction');
            if (!pendingTransaction) {
              throw new Error('Transaction data not found');
            }
            
            const transactionData = JSON.parse(pendingTransaction);
            console.log('📊 Transaction data retrieved:', transactionData);
            
            // Create and store transaction data
            const { transactionId, success } = createAndStoreTransaction(transactionData);
            
            if (!success) {
              console.error('❌ Failed to store transaction data reliably');
              toast.error("Storage Error", {
                description: "Failed to store transaction data. Please try again.",
              });
              // Continue anyway - we'll try to recover later
            }
            
            // Handle Kado redirection
            const redirectSuccess = await handleKadoRedirect(
              transactionId,
              transactionData,
              redirectToKadoAndReturn
            );
            
            if (!redirectSuccess) {
              throw new Error("Redirection failed");
            }
            
          } catch (error) {
            console.error('❌ Error in handleNext:', error);
            
            const newRetryCount = retryCount + 1;
            setRetryCount(newRetryCount);
            
            if (newRetryCount <= MAX_RETRIES) {
              toast.error("Connection Error", {
                description: `Retry ${newRetryCount}/${MAX_RETRIES}: Connecting to payment provider...`,
              });
              
              await new Promise(resolve => setTimeout(resolve, 1500));
              
              return handleNext();
            }
            
            toast.error("Redirection Error", {
              description: "Could not connect to payment provider after multiple attempts. Please try again later.",
            });
            
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
          console.error('❌ Unknown step:', currentStep);
      }
    } catch (error) {
      console.error('❌ Error in handleNext:', error);
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
      console.log('📝 Moving to previous step from:', currentStep);
      setRetryCount(0);
      
      switch (currentStep) {
        case 'payment':
          console.log('⏮️ Transitioning back to recipient step');
          setCurrentStep('recipient');
          break;
        case 'confirmation':
          console.log('⏮️ Transitioning back to payment step');
          setCurrentStep('payment');
          break;
        case 'recipient':
          console.log('⏮️ Already at first step, navigating to home');
          navigate('/');
          break;
        default:
          console.error('❌ Unknown step:', currentStep);
          navigate('/');
      }
    } catch (error) {
      console.error('❌ Error in handleBack:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  return {
    currentStep,
    isSubmitting: isSubmitting || isKadoLoading || isValidating || isRedirecting,
    error,
    handleNext,
    handleBack,
  };
};
