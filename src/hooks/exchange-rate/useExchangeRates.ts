import { useState, useEffect, useCallback } from 'react';
import { getExchangeRate } from '@/data/exchangeRates';
import { ExchangeRate } from './types';

/**
 * Hook for managing exchange rate calculations
 */
export const useExchangeRates = (
  sendAmount: string,
  sourceCurrency: string,
  targetCurrency: string
) => {
  const [exchangeRate, setExchangeRate] = useState(610); // Default rate for USD to XAF
  const [receiveAmount, setReceiveAmount] = useState('');
  const [allExchangeRates, setAllExchangeRates] = useState<ExchangeRate[]>([]);

  // Update exchange rate when currencies change
  useEffect(() => {
    const calculateRate = () => {
      // Get exchange rate from utility function
      const rate = getExchangeRate(sourceCurrency, targetCurrency);
      setExchangeRate(rate);
      
      const amount = parseFloat(sendAmount) || 0;
      setReceiveAmount((amount * rate).toLocaleString());
    };
    
    calculateRate();
  }, [sendAmount, sourceCurrency, targetCurrency]);

  // Generate all possible exchange rate combinations - memoized with useCallback
  const generateAllExchangeRates = useCallback((sendingCurrencies: string[], receivingCurrencies: string[]) => {
    console.log('Generating all exchange rates combinations');
    
    // Take at most 5 sending and 5 receiving currencies to keep the list manageable
    const topSendingCurrencies = sendingCurrencies.slice(0, 5);
    const topReceivingCurrencies = receivingCurrencies.slice(0, 5);
    
    const rates: ExchangeRate[] = [];
    
    topSendingCurrencies.forEach(from => {
      topReceivingCurrencies.forEach(to => {
        const rate = getExchangeRate(from, to);
        rates.push({ from, to, rate });
      });
    });
    
    setAllExchangeRates(rates);
  }, []);

  return {
    exchangeRate,
    receiveAmount,
    allExchangeRates,
    generateAllExchangeRates
  };
};
