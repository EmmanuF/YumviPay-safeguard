import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';
import { useKado } from '@/services/kado/useKado';
import { generateTransactionId } from '@/utils/transactionUtils';
import { createFallbackTransaction } from '@/services/transaction/utils/fallbackTransactions';

export type SendMoneyStep = 'recipient' | 'payment' | 'confirmation' | 'complete';

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

  const prepareCompleteTransactionData = (transactionData: any, transactionId: string) => {
    return {
      id: transactionId,
      transactionId: transactionId,
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
      
      sourceCurrency: transactionData.sourceCurrency || 'USD',
      targetCurrency: transactionData.targetCurrency || 'XAF',
      convertedAmount: transactionData.convertedAmount || transactionData.receiveAmount || '0',
      exchangeRate: transactionData.exchangeRate || 0,
    };
  };

  const storeTransactionData = (transactionId: string, data: any) => {
    try {
      const completeData = prepareCompleteTransactionData(data, transactionId);
      const storageData = JSON.stringify(completeData);
      
      console.log(`📦 Storing COMPLETE transaction ${transactionId} with redundancy:`, completeData);
      
      const storageKeys = [
        `transaction_${transactionId}`,
        `transaction_backup_${transactionId}`,
        `pendingKadoTransaction`,
        `pending_transaction_${Date.now()}`,
        `latest_transaction`
      ];
      
      storageKeys.forEach(key => {
        try {
          localStorage.setItem(key, storageData);
        } catch (e) {
          console.error(`❌ Failed to store in localStorage with key ${key}:`, e);
        }
      });
      
      try {
        sessionStorage.setItem(`transaction_session_${transactionId}`, storageData);
        sessionStorage.setItem('lastTransactionId', transactionId);
      } catch (e) {
        console.error('❌ Error storing in sessionStorage:', e);
      }
      
      // Safely access window properties with proper TypeScript handling
      try {
        // @ts-ignore - Emergency data access
        window.__EMERGENCY_TRANSACTION = storageData;
        // @ts-ignore - Emergency data access
        window.__TRANSACTION_ID = transactionId;
      } catch (e) {
        console.error('❌ Error storing in window object:', e);
      }
      
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
          console.log('✅ Transitioning to payment step');
          setCurrentStep('payment');
          break;
        case 'payment':
          // Check if name match is confirmed in transaction data
          const pendingTransaction = localStorage.getItem('pendingTransaction');
          if (pendingTransaction) {
            const data = JSON.parse(pendingTransaction);
            
            if (!data.nameMatchConfirmed) {
              toast.error("Confirmation Required", {
                description: "Please confirm that the recipient details are correct before proceeding.",
              });
              return;
            }
          }
          
          console.log('✅ Transitioning to confirmation step');
          setCurrentStep('confirmation');
          break;
        case 'confirmation':
          setIsSubmitting(true);
          console.log('🚀 Submitting transaction...');
          
          const transactionId = generateTransactionId();
          console.log(`🆔 Generated transaction ID: ${transactionId}`);
          
          try {
            const isConnected = await validateApiConnection();
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
            
            // Create a fallback transaction immediately
            const fallback = createFallbackTransaction(transactionId);
            console.log('Created fallback transaction before redirect:', fallback);
            
            const stored = storeTransactionData(transactionId, transactionData);
            if (!stored) {
              console.error('❌ Failed to store transaction data reliably');
              toast.error("Storage Error", {
                description: "Failed to store transaction data. Please try again.",
              });
              // Continue anyway - we'll try to recover later
            }
            
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
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const testMode = true;
            
            if (testMode) {
              console.log('🧪 TEST MODE: Using Kado redirect service directly');
              
              try {
                const { kadoRedirectService } = await import('@/services/kado/redirect');
                
                await kadoRedirectService.redirectToKado({
                  amount: transactionData.amount.toString(),
                  recipientName: transactionData.recipientName || 'Recipient',
                  recipientContact: transactionData.recipientContact || transactionData.recipient || '',
                  country: transactionData.targetCountry || 'CM',
                  paymentMethod: transactionData.paymentMethod || 'mobile_money',
                  transactionId,
                  returnUrl: `/transaction/${transactionId}`
                });
                
                // If we get here, the redirect didn't happen - force navigation
                navigate(`/transaction/${transactionId}`, { replace: true });
              } catch (e) {
                console.error('Error using direct Kado redirect service:', e);
                // Fallback to transaction page
                navigate(`/transaction/${transactionId}`, { replace: true });
              } finally {
                try {
                  document.body.removeChild(loadingDiv);
                } catch (e) {
                  console.error('Error removing loading div:', e);
                }
              }
              
              return;
            }
            
            await redirectToKadoAndReturn({
              amount: transactionData.amount.toString(),
              recipientName: transactionData.recipientName || 'Recipient',
              recipientContact: transactionData.recipientContact || transactionData.recipient || '',
              country: transactionData.targetCountry || 'CM',
              paymentMethod: transactionData.paymentMethod || 'mobile_money',
              transactionId,
            });
            
            try {
              document.body.removeChild(loadingDiv);
            } catch (e) {}
            
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
    isSubmitting: isSubmitting || isKadoLoading,
    error,
    handleNext,
    handleBack,
  };
};
