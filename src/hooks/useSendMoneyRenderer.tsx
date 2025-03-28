
import { useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { SendMoneyStep } from '@/hooks/useSendMoneySteps';

interface UseSendMoneyRendererProps {
  currentStep: SendMoneyStep;
  transactionData: any;
  updateTransactionData: (data: Partial<any>) => void;
}

export const useSendMoneyRenderer = ({
  currentStep,
  transactionData,
  updateTransactionData
}: UseSendMoneyRendererProps) => {
  const cachedDataRef = useRef<any>(null);
  
  // Prepare data for storage with exact confirmation screen values
  const prepareDataForStorage = (data: any, step: string) => {
    if (!data) return null;
    
    // Preserve the original amount across all steps
    const amount = data.amount || parseFloat(localStorage.getItem('lastTransactionAmount') || '0') || 0;
    
    // Calculate the correct convertedAmount based on actual amount and exchange rate
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
  }, [transactionData?.amount, transactionData?.exchangeRate, updateTransactionData]);
  
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

  return {
    cachedDataRef
  };
};
