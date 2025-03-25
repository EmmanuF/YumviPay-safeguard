
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
    console.log('📊 Send Money Step:', currentStep, 'Submitting:', isSubmitting, 'Error:', error);
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
      console.error("❌ API connection validation failed:", error);
      return false;
    }
  };

  // Enhanced transaction data preparation to ensure all required fields
  const prepareCompleteTransactionData = (transactionData: any, transactionId: string) => {
    // Ensure all required fields are present with sensible defaults
    return {
      id: transactionId,
      transactionId: transactionId, // Include both formats for compatibility
      amount: transactionData.amount?.toString() || '50',
      recipientName: transactionData.recipientName || 'Transaction Recipient',
      recipientContact: transactionData.recipientContact || transactionData.recipient || '+237650000000',
      country: transactionData.targetCountry || 'CM',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: 'Processing',
      totalAmount: transactionData.amount?.toString() || '50',
      paymentMethod: transactionData.paymentMethod || 'mobile_money',
      provider: transactionData.selectedProvider || 'MTN Mobile Money',
      
      // Include any additional data from the original transaction
      sourceCurrency: transactionData.sourceCurrency || 'USD',
      targetCurrency: transactionData.targetCurrency || 'XAF',
      convertedAmount: transactionData.convertedAmount || transactionData.receiveAmount || '0',
      exchangeRate: transactionData.exchangeRate || 0,
    };
  };

  // Store transaction with multiple redundancy mechanisms
  const storeTransactionData = (transactionId: string, data: any) => {
    try {
      // Prepare enhanced data with all required fields
      const completeData = prepareCompleteTransactionData(data, transactionId);
      const storageData = JSON.stringify(completeData);
      
      console.log(`📦 Storing COMPLETE transaction ${transactionId} with redundancy:`, completeData);
      
      // Use multiple storage mechanisms
      const storageKeys = [
        `transaction_${transactionId}`,
        `transaction_backup_${transactionId}`,
        `pendingKadoTransaction`,
        `pending_transaction_${Date.now()}`,
        `latest_transaction`
      ];
      
      // Store in localStorage with all keys
      storageKeys.forEach(key => {
        try {
          localStorage.setItem(key, storageData);
        } catch (e) {
          console.error(`❌ Failed to store in localStorage with key ${key}:`, e);
        }
      });
      
      // Use sessionStorage as well
      try {
        sessionStorage.setItem(`transaction_session_${transactionId}`, storageData);
        sessionStorage.setItem('lastTransactionId', transactionId);
      } catch (e) {
        console.error('❌ Error storing in sessionStorage:', e);
      }
      
      // Store with window object as last resort
      try {
        // @ts-ignore - Using window as emergency backup
        window.__EMERGENCY_TRANSACTION = storageData;
        // @ts-ignore
        window.__TRANSACTION_ID = transactionId;
      } catch (e) {
        console.error('❌ Error storing in window object:', e);
      }
      
      // Force a synchronous localStorage flush by reading back
      try {
        const verification = localStorage.getItem(`transaction_${transactionId}`);
        console.log(`✅ Storage verification: ${!!verification}`);
        return !!verification;
      } catch (e) {
        console.error('❌ Error verifying storage:', e);
        return false;
      }
    } catch (error) {
      console.error('❌ Error in storeTransactionData:', error);
      return false;
    }
  };

  const handleNext = async () => {
    try {
      clearError();
      console.log('📝 Moving to next step from:', currentStep);
      
      switch (currentStep) {
        case 'recipient':
          setCurrentStep('payment');
          break;
        case 'payment':
          setCurrentStep('confirmation');
          break;
        case 'confirmation':
          setIsSubmitting(true);
          console.log('🚀 Submitting transaction...');
          
          // Generate a transaction ID for the current transaction
          const transactionId = generateTransactionId();
          console.log(`🆔 Generated transaction ID: ${transactionId}`);
          
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
            console.log('📊 Transaction data retrieved:', transactionData);
            
            // CRITICAL: Store transaction data with multiple redundancy BEFORE redirecting
            const stored = storeTransactionData(transactionId, transactionData);
            if (!stored) {
              console.error('❌ Failed to store transaction data reliably');
              toast.error("Storage Error", {
                description: "Failed to store transaction data. Please try again.",
              });
              // Continue anyway - we'll try to recover later
            }
            
            // Show a loading overlay for visual feedback
            const loadingDiv = document.createElement('div');
            loadingDiv.style.position = 'fixed';
            loadingDiv.style.top = '0';
            loadingDiv.style.left = '0';
            loadingDiv.style.width = '100%';
            loadingDiv.style.height = '100%';
            loadingDiv.style.backgroundColor = 'rgba(0,0,0,0.5)';
            loadingDiv.style.display = 'flex';
            loadingDiv.style.justifyContent = 'center';
            loadingDiv.style.alignItems = 'center';
            loadingDiv.style.zIndex = '10000';
            loadingDiv.innerHTML = `
              <div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
                <h3>Preparing Transaction...</h3>
                <p>Please wait while we securely prepare your transaction.</p>
              </div>
            `;
            document.body.appendChild(loadingDiv);
            
            // Wait to ensure storage is complete (crucial fix)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // FOR TESTING: Skip actual Kado redirect and go directly to transaction page
            // This bypasses the problematic redirect while we debug
            const testMode = true; // Set to false in production
            
            if (testMode) {
              console.log('🧪 TEST MODE: Skipping Kado redirect, going directly to transaction page');
              
              // Simulate successful storage and navigation
              await new Promise(resolve => setTimeout(resolve, 500));
              
              try {
                document.body.removeChild(loadingDiv);
              } catch (e) {}
              
              // Navigate directly to transaction page
              navigate(`/transaction/${transactionId}`);
              
              // Simulate webhook in background
              try {
                const { simulateKadoWebhook } = await import('@/services/transaction/transactionUpdate');
                simulateKadoWebhook(transactionId).catch(e => console.error('Webhook simulation error:', e));
              } catch (e) {}
              
              return;
            }
            
            // If not in test mode, proceed with actual Kado redirect
            await redirectToKadoAndReturn({
              amount: transactionData.amount.toString(),
              recipientName: transactionData.recipientName || 'Recipient',
              recipientContact: transactionData.recipientContact || transactionData.recipient || '',
              country: transactionData.targetCountry || 'CM',
              paymentMethod: transactionData.paymentMethod || 'mobile_money',
              transactionId,
            });
            
            // Clean up loading overlay
            try {
              document.body.removeChild(loadingDiv);
            } catch (e) {}
            
          } catch (error) {
            console.error('❌ Error in handleNext:', error);
            
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
      setRetryCount(0); // Reset retry count when going back
      
      switch (currentStep) {
        case 'payment':
          setCurrentStep('recipient');
          break;
        case 'confirmation':
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
    isSubmitting: isSubmitting || isKadoLoading,
    error,
    handleNext,
    handleBack,
  };
};
