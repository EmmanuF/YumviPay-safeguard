
import { useState, useEffect } from 'react';
import { useCountries } from './useCountries';
import { toast } from 'sonner';

export interface TransactionData {
  amount: number;
  sourceCurrency: string;
  targetCurrency: string;
  targetCountry: string;
  convertedAmount: number;
  recipient: string | null;
  recipientName: string;
  paymentMethod: string | null;
  selectedProvider: string;
  isRecurring?: boolean;
  recurringFrequency?: string | null;
}

export const useSendMoneyTransaction = (defaultCountryCode: string = 'CM') => {
  const { countries } = useCountries();
  const [isInitialized, setInitialDataLoaded] = useState(false);
  const [error, setError] = useState<string | Error | null>(null);
  
  // Find the default country by code
  const defaultCountry = countries.find(c => c.code === defaultCountryCode) || 
                         countries.find(c => c.code === 'CM');
  
  console.log('useSendMoneyTransaction initialized with country:', { 
    defaultCountryCode,
    defaultCountry,
    countriesLoaded: countries.length > 0
  });
  
  const [transactionData, setTransactionData] = useState<TransactionData>({
    amount: 0,
    sourceCurrency: 'USD',
    targetCurrency: defaultCountry?.currency || 'XAF',
    targetCountry: defaultCountry?.code || 'CM',
    convertedAmount: 0,
    recipient: null,
    recipientName: '',
    paymentMethod: null,
    selectedProvider: '',
    isRecurring: false,
    recurringFrequency: null
  });

  // Load pending transaction from localStorage if available
  useEffect(() => {
    console.log('Transaction data initialization running, countries loaded:', countries.length);
    
    try {
      // Check various storage locations with improved logging
      console.log('Checking for existing transaction data in multiple storage locations');
      
      // First, check for lastTransactionAmount for explicit amount tracking
      const lastAmount = localStorage.getItem('lastTransactionAmount');
      
      // Try different storage locations in order of preference
      const processedPendingTransaction = localStorage.getItem('processedPendingTransaction');
      const pendingTransactionBackup = localStorage.getItem('pendingTransactionBackup');
      const pendingTransaction = processedPendingTransaction || 
                               pendingTransactionBackup || 
                               localStorage.getItem('pendingTransaction');
      
      if (pendingTransaction) {
        try {
          const data = JSON.parse(pendingTransaction);
          console.log('Found pending transaction data:', data);
          
          // Find the country with matching currency code
          const targetCountry = countries.find(c => c.currency === data.targetCurrency)?.code || 'CM';
          
          // Use the explicit amount from data if available, fallback to parsed amount
          const amount = parseFloat(data.sendAmount || data.amount || lastAmount || '0');
          
          // Use the explicit convertedAmount from data if available, fallback to parsed receiveAmount
          const convertedAmount = parseFloat(
            data.convertedAmount?.toString() || 
            data.receiveAmount?.replace?.(/,/g, '') || 
            '0'
          );
          
          console.log('Using parsed transaction values:', {
            amount,
            convertedAmount,
            sourceCurrency: data.sourceCurrency,
            targetCurrency: data.targetCurrency
          });
          
          setTransactionData(prev => ({
            ...prev,
            amount: amount,
            sourceCurrency: data.sourceCurrency || 'USD',
            targetCurrency: data.targetCurrency || 'XAF',
            targetCountry,
            convertedAmount: convertedAmount,
          }));
          
          // Immediately store the parsed values back to ensure consistency
          const updatedData = {
            ...data,
            amount: amount,
            sendAmount: amount.toString(),
            convertedAmount: convertedAmount,
          };
          
          // Store this accurate data back in all storage locations
          localStorage.setItem('pendingTransaction', JSON.stringify(updatedData));
          localStorage.setItem('pendingTransactionBackup', JSON.stringify(updatedData));
          localStorage.setItem('processedPendingTransaction', JSON.stringify(updatedData));
          localStorage.setItem('lastTransactionAmount', amount.toString());
          
          // Clear the source transaction data after processing to prevent stale data reuse
          setTimeout(() => {
            localStorage.removeItem('pendingTransaction');
          }, 500);
        } catch (error) {
          console.error('Error parsing pending transaction:', error);
          setError('Failed to load transaction data. Please try again.');
          
          // Show toast for debugging
          toast.error("Error Loading Transaction", {
            description: "Could not parse transaction data",
          });
        }
      } else {
        console.log('No pending transaction found, using default values');
        
        // If we have a lastTransactionAmount but no pending transaction,
        // at least update the amount field
        if (lastAmount) {
          const parsedAmount = parseFloat(lastAmount);
          if (!isNaN(parsedAmount) && parsedAmount > 0) {
            console.log(`Using last known amount: ${parsedAmount}`);
            setTransactionData(prev => ({
              ...prev,
              amount: parsedAmount,
            }));
          }
        }
      }
    } catch (err) {
      console.error('Error in transaction initialization:', err);
      setError('An error occurred while loading transaction data. Please refresh the page.');
    } finally {
      // Always set initialization as completed to avoid infinite loading
      console.log('Transaction data initialization complete');
      setInitialDataLoaded(true);
    }
  }, [countries]);

  const updateTransactionData = (data: Partial<TransactionData>) => {
    console.log('Updating transaction data:', data);
    
    // If amount is being updated, also store it separately for redundancy
    if (data.amount !== undefined) {
      localStorage.setItem('lastTransactionAmount', data.amount.toString());
      console.log(`Storing explicit amount in lastTransactionAmount: ${data.amount}`);
    }
    
    setTransactionData(prev => {
      const updated = { ...prev, ...data };
      
      // Store the updated data for recovery if needed
      try {
        localStorage.setItem('currentTransactionData', JSON.stringify(updated));
      } catch (e) {
        console.error('Error storing current transaction data:', e);
      }
      
      return updated;
    });
  };

  return {
    transactionData,
    updateTransactionData,
    isInitialized,
    error,
  };
};
