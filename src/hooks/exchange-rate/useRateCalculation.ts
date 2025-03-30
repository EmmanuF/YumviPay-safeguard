
import { useState, useEffect } from 'react';
import { RateCalculationProps } from './types';
import { useLiveExchangeRates } from './useLiveExchangeRates';

export const useRateCalculation = ({
  sendAmount,
  sourceCurrency,
  targetCurrency
}: RateCalculationProps) => {
  const [receiveAmount, setReceiveAmount] = useState('');
  
  // Get live exchange rate updates
  const { 
    rate: exchangeRate, 
    isLoading,
    error
  } = useLiveExchangeRates({
    sourceCurrency,
    targetCurrency,
    initialRate: sourceCurrency === 'USD' && targetCurrency === 'XAF' ? 610 : 0,
    updateIntervalMs: 60000 // Update every minute
  });

  // Calculate receive amount whenever input values change
  useEffect(() => {
    console.log("🧮 Calculating exchange rate from", sourceCurrency, "to", targetCurrency);
    
    try {
      if (isLoading && exchangeRate === 0) {
        // Don't update yet if we're still loading the initial rate
        return;
      }

      // Use the live rate from the API
      console.log(`💱 Using exchange rate: 1 ${sourceCurrency} = ${exchangeRate} ${targetCurrency}`);
      
      // Calculate the receive amount
      const amount = parseFloat(sendAmount) || 0;
      const converted = (amount * exchangeRate).toFixed(2);
      setReceiveAmount(converted);
      console.log(`🔢 Receive amount calculated: ${sendAmount} ${sourceCurrency} = ${converted} ${targetCurrency}`);
    } catch (err) {
      console.error("Error calculating exchange rate:", err);
      setReceiveAmount('Error');
    }
  }, [sendAmount, sourceCurrency, targetCurrency, exchangeRate, isLoading]);

  return {
    exchangeRate,
    receiveAmount,
    isLoading,
    error
  };
};
