
import { useState, useEffect } from 'react';
import { useCountries } from './useCountries';
import { toast } from 'sonner';
import { getTransactionData, initializeStore } from '@/utils/transactionDataStore';

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

  // Initialize transaction data from our store
  useEffect(() => {
    console.log('Transaction data initialization running, countries loaded:', countries.length);
    
    try {
      // Initialize our store (creates default data if needed)
      const storedData = initializeStore();
      
      console.log('Retrieved transaction data from store:', storedData);
      
      if (storedData) {
        // Find the country with matching currency code
        const targetCountry = countries.find(c => c.currency === storedData.targetCurrency)?.code || 'CM';
        
        // Update transaction data state with stored values
        setTransactionData(prev => ({
          ...prev,
          amount: storedData.amount,
          sourceCurrency: storedData.sourceCurrency,
          targetCurrency: storedData.targetCurrency,
          targetCountry,
          convertedAmount: storedData.convertedAmount,
          recipientName: storedData.recipientName || '',
          recipient: storedData.recipientContact || null,
        }));
        
        console.log('Set transaction data from store with amount:', storedData.amount);
      } else {
        console.log('No stored transaction data found, using default values');
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
    
    setTransactionData(prev => {
      const updated = { ...prev, ...data };
      
      // Also update our centralized store
      try {
        import('@/utils/transactionDataStore').then(({ setTransactionData }) => {
          setTransactionData({
            amount: updated.amount,
            sourceCurrency: updated.sourceCurrency,
            targetCurrency: updated.targetCurrency,
            exchangeRate: updated.convertedAmount / updated.amount,
            convertedAmount: updated.convertedAmount,
            recipientName: updated.recipientName,
            recipientContact: updated.recipient || undefined,
            recipientCountry: updated.targetCountry,
            paymentMethod: updated.paymentMethod || undefined,
            provider: updated.selectedProvider || undefined
          });
        });
      } catch (e) {
        console.error('Error updating transaction data store:', e);
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
