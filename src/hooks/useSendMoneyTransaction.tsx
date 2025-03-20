
import { useState, useEffect } from 'react';
import { useCountries } from './useCountries';

export interface TransactionData {
  amount: number;
  sourceCurrency: string;
  targetCurrency: string;
  targetCountry: string;
  convertedAmount: number;
  recipient: string | null;
  recipientName: string;
  recipientContact?: string;
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
    recipientContact: '',
    paymentMethod: null,
    selectedProvider: '',
    isRecurring: false,
    recurringFrequency: null
  });

  // Load pending transaction from localStorage if available
  useEffect(() => {
    console.log('Transaction data initialization running, countries loaded:', countries.length);
    
    try {
      // First try to get the processed transaction from the refactored flow
      const processedPendingTransaction = localStorage.getItem('processedPendingTransaction');
      const pendingTransaction = processedPendingTransaction || localStorage.getItem('pendingTransaction');
      
      if (pendingTransaction) {
        try {
          const data = JSON.parse(pendingTransaction);
          console.log('Found pending transaction:', data);
          
          // Find the country with matching currency code
          const targetCountry = countries.find(c => c.currency === data.targetCurrency)?.code || 'CM';
          
          setTransactionData(prev => ({
            ...prev,
            amount: parseFloat(data.amount) || 0,
            sourceCurrency: data.sourceCurrency || 'USD',
            targetCurrency: data.targetCurrency || 'XAF',
            targetCountry,
            convertedAmount: parseFloat(data.receiveAmount?.replace(/,/g, '')) || 0,
          }));
          
          // Clear the pending transaction data
          localStorage.removeItem('pendingTransaction');
          localStorage.removeItem('processedPendingTransaction');
        } catch (error) {
          console.error('Error parsing pending transaction:', error);
          setError('Failed to load transaction data. Please try again.');
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
    setTransactionData(prev => ({ ...prev, ...data }));
  };

  return {
    transactionData,
    updateTransactionData,
    isInitialized,
    error,
  };
};
