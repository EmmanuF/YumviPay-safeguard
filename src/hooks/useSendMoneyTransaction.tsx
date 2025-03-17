
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
  paymentMethod: string | null;
  selectedProvider: string;
}

export const useSendMoneyTransaction = (defaultCountryCode: string = 'CM') => {
  const { countries } = useCountries();
  const [isInitialized, setInitialDataLoaded] = useState(false);
  
  // Find the default country by code
  const defaultCountry = countries.find(c => c.code === defaultCountryCode) || 
                         countries.find(c => c.code === 'CM');
  
  const [transactionData, setTransactionData] = useState<TransactionData>({
    amount: 100,
    sourceCurrency: 'USD',
    targetCurrency: defaultCountry?.currency || 'XAF',
    targetCountry: defaultCountry?.code || 'CM',
    convertedAmount: 61000,
    recipient: null,
    recipientName: '',
    paymentMethod: null,
    selectedProvider: '',
  });

  // Load pending transaction from localStorage if available
  useEffect(() => {
    const timer = setTimeout(() => {
      const pendingTransaction = localStorage.getItem('pendingTransaction');
      
      if (pendingTransaction) {
        try {
          const data = JSON.parse(pendingTransaction);
          console.log('Found pending transaction:', data);
          
          // Find the country with matching currency code
          const targetCountry = countries.find(c => c.currency === data.targetCurrency)?.code || 'CM';
          
          setTransactionData(prev => ({
            ...prev,
            amount: parseFloat(data.sendAmount) || 100,
            sourceCurrency: data.sourceCurrency || 'USD',
            targetCurrency: data.targetCurrency || 'XAF',
            targetCountry,
            convertedAmount: parseFloat(data.receiveAmount?.replace(/,/g, '')) || 61000,
          }));
          
          localStorage.removeItem('pendingTransaction');
        } catch (error) {
          console.error('Error parsing pending transaction:', error);
        }
      }
      
      setInitialDataLoaded(true);
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
  };
};
