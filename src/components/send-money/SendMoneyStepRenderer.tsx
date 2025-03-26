
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import RecipientStep from './RecipientStep';
import PaymentStep from './PaymentStep';
import ConfirmationStep from './ConfirmationStep';
import { SendMoneyStep } from '@/hooks/useSendMoneySteps';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import LoadingState from '@/components/transaction/LoadingState';
import { toast } from 'sonner';

interface SendMoneyStepRendererProps {
  currentStep: SendMoneyStep;
  transactionData: any;
  updateTransactionData: (data: Partial<any>) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  error?: string | null;
}

const SendMoneyStepRenderer: React.FC<SendMoneyStepRendererProps> = ({
  currentStep,
  transactionData,
  updateTransactionData,
  onNext,
  onBack,
  isSubmitting,
  error
}) => {
  console.log('[SendMoneyStepRenderer] Rendering step:', currentStep, 'with handlers:', {
    onNext: typeof onNext,
    onBack: typeof onBack
  });
  
  const cachedDataRef = useRef<any>(null);
  
  // Prepare data for storage with exact confirmation screen values
  const prepareDataForStorage = (data: any, step: string) => {
    if (!data) return null;
    
    // Preserve the original amount across all steps
    const amount = data.amount || parseFloat(localStorage.getItem('lastTransactionAmount') || '0') || 0;
    
    // Calculate the correct convertedAmount based on actual amount and exchange rate
    // This fixes the inconsistency between initial calculation and confirmation
    const exchangeRate = data.exchangeRate || 610;
    const calculatedConvertedAmount = amount * exchangeRate;
    
    // Enhance transaction data with confirmation screen values
    const enhancedData = {
      ...data,
      
      // Always preserve the correct amount values
      amount: amount,
      sendAmount: amount.toString(),
      
      // Ensure correct converted amount based on the exchange rate
      convertedAmount: calculatedConvertedAmount,
      receiveAmount: calculatedConvertedAmount.toString(),
      
      // If we're on recipient step, ensure recipient fields
      ...(step === 'recipient' && {
        recipientName: data.recipientName || 'John Doe',
        recipientContact: data.recipientContact || data.recipient || '+237612345678',
      }),
      
      // If we're on payment step, ensure payment fields match the confirmation screen values
      ...(step === 'payment' && {
        paymentMethod: data.paymentMethod || 'mtn-mobile-money',
        provider: data.selectedProvider || 'MTN Mobile Money',
      }),
      
      // If we're on confirmation step, add all fields needed for transaction loading
      ...(step === 'confirmation' && {
        paymentMethod: data.paymentMethod || 'mtn-mobile-money',
        provider: data.selectedProvider || 'MTN Mobile Money',
        currency: data.targetCurrency || 'XAF',
        exchangeRate: data.exchangeRate || 610,
        fee: data.fee || '0',
        totalAmount: amount,
      }),
      
      // Common required fields with confirmation screen values
      country: data.targetCountry || 'CM',
      lastStep: step,
      timestamp: new Date().toISOString()
    };
    
    return enhancedData;
  };
  
  // Re-calculate and synchronize convertedAmount whenever transactionData.amount changes
  useEffect(() => {
    if (transactionData && transactionData.amount && transactionData.exchangeRate) {
      const calculatedConvertedAmount = transactionData.amount * transactionData.exchangeRate;
      
      // Only update if there's a significant difference to avoid infinite loops
      if (Math.abs(calculatedConvertedAmount - transactionData.convertedAmount) > 1) {
        console.log(`Resynchronizing convertedAmount based on amount ${transactionData.amount} and exchange rate ${transactionData.exchangeRate}`);
        console.log(`Old: ${transactionData.convertedAmount}, New: ${calculatedConvertedAmount}`);
        
        updateTransactionData({
          convertedAmount: calculatedConvertedAmount
        });
      }
    }
  }, [transactionData?.amount, transactionData?.exchangeRate]);
  
  // Safeguard: Pre-cache the current step's transaction data for recovery
  useEffect(() => {
    if (transactionData && currentStep) {
      try {
        // Prepare enhanced data
        const enhancedData = prepareDataForStorage(transactionData, currentStep);
        if (!enhancedData) return;
        
        // Cache data in memory for immediate recovery
        cachedDataRef.current = enhancedData;
        
        // Store current step's transaction data for potential recovery
        localStorage.setItem(`step_${currentStep}_data`, JSON.stringify(enhancedData));
        
        // Also store complete copy in pendingTransaction for global recovery
        localStorage.setItem('pendingTransaction', JSON.stringify(enhancedData));
        localStorage.setItem('pendingTransactionBackup', JSON.stringify(enhancedData));
        localStorage.setItem('lastStep', currentStep);
        localStorage.setItem('lastTransactionAmount', enhancedData.amount.toString());
        
        console.log(`Cached enhanced transaction data for step ${currentStep}:`, enhancedData);
      } catch (e) {
        console.error('Error caching step data:', e);
      }
    }
  }, [currentStep, transactionData]);
  
  // For confirmation step, store the transaction data in multiple places for redundancy
  useEffect(() => {
    if (currentStep === 'confirmation' && transactionData) {
      try {
        // Prepare enhanced data with exact confirmation screen values
        const enhancedData = prepareDataForStorage(transactionData, 'confirmation');
        if (!enhancedData) return;
        
        // Add additional fields specifically needed for transaction loading
        enhancedData.recipientName = enhancedData.recipientName || 'John Doe';
        enhancedData.recipientContact = enhancedData.recipientContact || enhancedData.recipient || '+237612345678';
        enhancedData.country = enhancedData.targetCountry || 'CM';
        enhancedData.provider = enhancedData.selectedProvider || 'MTN Mobile Money';
        enhancedData.paymentMethod = enhancedData.paymentMethod || 'mtn-mobile-money';
        enhancedData.estimatedDelivery = 'Processing';
        enhancedData.status = 'pending';
        
        // Ensure the amount and converted amount are consistent
        const amount = enhancedData.amount || parseFloat(localStorage.getItem('lastTransactionAmount') || '0');
        enhancedData.amount = amount;
        enhancedData.sendAmount = amount.toString();
        enhancedData.totalAmount = amount;
        
        // Recalculate convertedAmount to ensure consistency
        const exchangeRate = enhancedData.exchangeRate || 610;
        enhancedData.convertedAmount = amount * exchangeRate;
        enhancedData.receiveAmount = enhancedData.convertedAmount.toString();
        
        // Serialize with all required fields
        const serializedData = JSON.stringify(enhancedData);
        
        // Store in multiple places for maximum reliability
        localStorage.setItem('confirmed_transaction_data', serializedData);
        localStorage.setItem('pending_transaction_backup', serializedData);
        localStorage.setItem('processedPendingTransaction', serializedData);
        sessionStorage.setItem('confirm_transaction_session', serializedData);
        
        console.log('Stored enhanced confirmation step data with redundancy:', enhancedData);
      } catch (e) {
        console.error('Error storing confirmation data:', e);
      }
    }
  }, [currentStep, transactionData]);
  
  // Show loading state if we're submitting with transaction ID if available
  if (isSubmitting) {
    return (
      <LoadingState 
        message="Processing your request..." 
        submessage="Please wait while we complete this step"
        transactionId={transactionData?.id || transactionData?.transactionId}
        timeout={500} // Very short timeout during step processing
      />
    );
  }
  
  // Show error state if there's an error
  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check if we have required transaction data
  if (!transactionData) {
    console.error('Missing transaction data in step renderer');
    // Try to recover from cached step data
    try {
      // First try in-memory cache for fastest recovery
      if (cachedDataRef.current) {
        console.log(`Recovered data from in-memory cache:`, cachedDataRef.current);
        updateTransactionData(cachedDataRef.current);
        return (
          <div className="p-4 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <p className="mt-2">Transaction data recovered, loading...</p>
          </div>
        );
      }
      
      // Try local storage next
      const cachedStepData = localStorage.getItem(`step_${currentStep}_data`);
      if (cachedStepData) {
        const parsed = JSON.parse(cachedStepData);
        console.log(`Recovered data for step ${currentStep} from localStorage:`, parsed);
        
        // Update transaction data with recovered data
        updateTransactionData(parsed);
        
        toast.success("Data Recovered", {
          description: "Successfully recovered your transaction data",
        });
        
        // Return temporary loading placeholder while data is being updated
        return (
          <div className="p-4 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <p className="mt-2">Transaction data recovered, loading...</p>
          </div>
        );
      }
      
      // Try to find data from any step
      const lastStep = localStorage.getItem('lastStep');
      if (lastStep) {
        const lastStepData = localStorage.getItem(`step_${lastStep}_data`);
        if (lastStepData) {
          const parsed = JSON.parse(lastStepData);
          console.log(`Recovered data from previous step ${lastStep}:`, parsed);
          updateTransactionData(parsed);
          
          toast.success("Data Recovered", {
            description: "Recovered data from your previous step",
          });
          
          return (
            <div className="p-4 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <p className="mt-2">Previous step data recovered, loading...</p>
            </div>
          );
        }
      }
      
      // Try the pending transaction as a last resort
      const pendingTransaction = localStorage.getItem('pendingTransaction');
      if (pendingTransaction) {
        const parsed = JSON.parse(pendingTransaction);
        console.log(`Recovered data from pendingTransaction:`, parsed);
        updateTransactionData(parsed);
        
        toast.success("Data Recovered", {
          description: "Retrieved your pending transaction",
        });
        
        return (
          <div className="p-4 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <p className="mt-2">Pending transaction retrieved, loading...</p>
          </div>
        );
      }
    } catch (e) {
      console.error('Error recovering step data:', e);
    }
    
    return (
      <LoadingState 
        message="Error loading transaction data" 
        submessage="Please try refreshing the page" 
      />
    );
  }

  const renderStep = () => {
    try {
      console.log(`[SendMoneyStepRenderer] Rendering step: ${currentStep} with handlers:`, {
        onNext: typeof onNext,
        onBack: typeof onBack
      });
      
      switch (currentStep) {
        case 'recipient':
          return (
            <RecipientStep
              transactionData={transactionData}
              updateTransactionData={updateTransactionData}
              onNext={onNext}
              onBack={onBack}
            />
          );
        case 'payment':
          console.log('[SendMoneyStepRenderer] Rendering PaymentStep with handlers', {
            onNext: typeof onNext, 
            onBack: typeof onBack
          });
          return (
            <PaymentStep
              transactionData={transactionData}
              updateTransactionData={updateTransactionData}
              onNext={onNext}
              onBack={onBack}
              isSubmitting={isSubmitting}
            />
          );
        case 'confirmation':
          return (
            <ConfirmationStep
              transactionData={transactionData}
              onConfirm={onNext}
              onBack={onBack}
              isSubmitting={isSubmitting}
            />
          );
        default:
          console.error('Unknown step:', currentStep);
          return (
            <div className="p-4 text-center">
              <p>Unknown step: {currentStep}</p>
              <button 
                onClick={onBack}
                className="mt-4 px-4 py-2 bg-primary rounded-md text-white"
              >
                Go Back
              </button>
            </div>
          );
      }
    } catch (e) {
      console.error('[SendMoneyStepRenderer] Error rendering step:', e);
      return (
        <div className="p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              An error occurred while rendering this step. Please try again.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <button 
              onClick={onBack}
              className="px-4 py-2 bg-gray-200 rounded-md text-gray-800"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {renderStep()}
    </motion.div>
  );
};

export default SendMoneyStepRenderer;
