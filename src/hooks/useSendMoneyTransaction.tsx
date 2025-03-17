
import { useState, useEffect } from 'react';
import { useCountries } from './useCountries';

export interface TransactionData {
  amount: number; // This should be a number
  sourceCurrency: string;
  targetCurrency: string;
  targetCountry: string;
  convertedAmount: number;
  recipient: string | null;
  recipientName: string;
  paymentMethod: string | null;
  selectedProvider: string;
}

export const useSendMoneyTransaction = (defaultCountryCode: string = 'CM') => {
  const { countries } = useCountries();
  const [isInitialized, setInitialDataLoaded] = useState(false);
  const [error, setError] = useState<string | Error | null>(null);
  
  // Find the default country by code
  const defaultCountry = countries.find(c => c.code === defaultCountryCode) || 
                         countries.find(c => c.code === 'CM');
  
  const [transactionData, setTransactionData] = useState<TransactionData>({
    amount: 0, // Start with 0 so we'll need to collect initial data
    sourceCurrency: 'USD',
    targetCurrency: defaultCountry?.currency || 'XAF',
    targetCountry: defaultCountry?.code || 'CM',
    convertedAmount: 0, // Start with 0
    recipient: null,
    recipientName: '',
    paymentMethod: null,
    selectedProvider: '',
  });

  // Load pending transaction from localStorage if available
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const pendingTransaction = localStorage.getItem('pendingTransaction');
        
        if (pendingTransaction) {
          try {
            const data = JSON.parse(pendingTransaction);
            console.log('Found pending transaction:', data);
            
            // Find the country with matching currency code
            const targetCountry = countries.find(c => c.currency === data.targetCurrency)?.code || 'CM';
            
            setTransactionData(prev => ({
              ...prev,
              amount: parseFloat(data.amount) || 0, // Make sure this is a number
              sourceCurrency: data.sourceCurrency || 'USD',
              targetCurrency: data.targetCurrency || 'XAF',
              targetCountry,
              convertedAmount: parseFloat(data.receiveAmount?.replace(/,/g, '')) || 0,
            }));
            
            localStorage.removeItem('pendingTransaction');
          } catch (error) {
            console.error('Error parsing pending transaction:', error);
            setError('Failed to load transaction data. Please try again.');
          }
        }
      } catch (err) {
        console.error('Error in transaction initialization:', err);
        setError('An error occurred while loading transaction data. Please refresh the page.');
      } finally {
        setInitialDataLoaded(true);
      }
    }, 100);
    
    return () => clearTimeout(timer);
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
