
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
      // First, check for lastTransactionAmount for explicit amount tracking
      const lastAmount = localStorage.getItem('lastTransactionAmount');
      console.log('Last transaction amount from storage:', lastAmount);
      
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
          
          // Get the amount directly - prioritize sendAmount over amount for consistency
          const amount = data.sendAmount ? parseFloat(data.sendAmount) : 
                         data.amount ? parseFloat(data.amount.toString()) :
                         lastAmount ? parseFloat(lastAmount) : 0;
          
          console.log('Parsed amount from transaction data:', amount);
          
          // Calculate the converted amount based on the exchange rate
          const exchangeRate = data.exchangeRate || 610;
          const convertedAmount = amount * exchangeRate;
          
          console.log('Using amount:', amount, 'with exchange rate:', exchangeRate, '= converted amount:', convertedAmount);
          
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
            receiveAmount: convertedAmount.toString()
          };
          
          console.log('Storing updated transaction data:', updatedData);
          
          // Store this accurate data back in all storage locations
          localStorage.setItem('pendingTransaction', JSON.stringify(updatedData));
          localStorage.setItem('pendingTransactionBackup', JSON.stringify(updatedData));
          localStorage.setItem('processedPendingTransaction', JSON.stringify(updatedData));
          localStorage.setItem('lastTransactionAmount', amount.toString());
        } catch (error) {
          console.error('Error parsing pending transaction:', error);
          setError('Failed to load transaction data. Please try again.');
          
          // Show toast for debugging
          toast.error("Error Loading Transaction", {
            description: "Could not parse transaction data",
          });
        }
      } else if (lastAmount) {
        // If we only have lastTransactionAmount but no pending transaction,
        // at least update the amount field
        const parsedAmount = parseFloat(lastAmount);
        if (!isNaN(parsedAmount) && parsedAmount > 0) {
          console.log(`Using last known amount: ${parsedAmount}`);
          
          // Calculate converted amount based on default exchange rate
          const exchangeRate = 610; // Default exchange rate
          const convertedAmount = parsedAmount * exchangeRate;
          
          setTransactionData(prev => ({
            ...prev,
            amount: parsedAmount,
            convertedAmount: convertedAmount
          }));
          
          // Store minimal transaction data
          const minimalData = {
            amount: parsedAmount,
            sendAmount: parsedAmount.toString(),
            convertedAmount: convertedAmount,
            receiveAmount: convertedAmount.toString(),
            sourceCurrency: 'USD',
            targetCurrency: 'XAF',
            exchangeRate: exchangeRate,
            timestamp: new Date().toISOString()
          };
          
          localStorage.setItem('pendingTransaction', JSON.stringify(minimalData));
          localStorage.setItem('pendingTransactionBackup', JSON.stringify(minimalData));
        }
      } else {
        console.log('No pending transaction found, using default values');
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
    
    // Handle amount updates with special care
    if (data.amount !== undefined) {
      // Store amount in localStorage for redundancy and quick access
      localStorage.setItem('lastTransactionAmount', data.amount.toString());
      console.log(`Storing explicit amount in lastTransactionAmount: ${data.amount}`);
      
      // If we're updating the amount, we should update convertedAmount too if we have an exchange rate
      if (transactionData.sourceCurrency && transactionData.targetCurrency) {
        // Use a fixed exchange rate for consistent calculation
        const exchangeRate = 610;
        const convertedAmount = data.amount * exchangeRate;
        
        console.log(`Auto-updating convertedAmount based on new amount: ${data.amount} * ${exchangeRate} = ${convertedAmount}`);
        
        // Include convertedAmount in the update
        data.convertedAmount = convertedAmount;
      }
    }
    
    setTransactionData(prev => {
      const updated = { ...prev, ...data };
      
      // Store the updated data for recovery if needed
      try {
        // Also update the pending transaction data if it exists
        const pendingData = localStorage.getItem('pendingTransaction');
        if (pendingData) {
          const parsed = JSON.parse(pendingData);
          const updatedPending = { 
            ...parsed,
            ...data,
            // Always include these critical fields
            amount: updated.amount,
            sendAmount: updated.amount.toString(),
            convertedAmount: updated.convertedAmount,
            receiveAmount: updated.convertedAmount.toString(),
            timestamp: new Date().toISOString()
          };
          
          localStorage.setItem('pendingTransaction', JSON.stringify(updatedPending));
          localStorage.setItem('pendingTransactionBackup', JSON.stringify(updatedPending));
          localStorage.setItem('currentTransactionData', JSON.stringify(updated));
          
          console.log('Updated pending transaction data:', updatedPending);
        } else {
          // If no pending data exists, store current state
          localStorage.setItem('currentTransactionData', JSON.stringify(updated));
        }
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
