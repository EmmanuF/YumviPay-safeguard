
import { useState, useEffect } from 'react';
import { getExchangeRate } from '@/data/exchangeRates';

export interface UseRateCalculationOptions {
  sendAmount: string;
  sourceCurrency: string;
  targetCurrency: string;
}

export const useRateCalculation = ({
  sendAmount, 
  sourceCurrency, 
  targetCurrency
}: UseRateCalculationOptions) => {
  const [exchangeRate, setExchangeRate] = useState(610); // Updated default rate for USD to XAF
  const [receiveAmount, setReceiveAmount] = useState('');

  useEffect(() => {
    const calculateRate = () => {
      // Get exchange rate from utility function
      const rate = getExchangeRate(sourceCurrency, targetCurrency);
      setExchangeRate(rate);
      
      const amount = parseFloat(sendAmount) || 0;
      setReceiveAmount((amount * rate).toLocaleString());
      
      console.log(`💱 Exchange rate calculated: 1 ${sourceCurrency} = ${rate} ${targetCurrency}`);
      console.log(`💰 For amount ${sendAmount} ${sourceCurrency} → ${(amount * rate).toLocaleString()} ${targetCurrency}`);
    };
    
    calculateRate();
  }, [sendAmount, sourceCurrency, targetCurrency]);

  return {
    exchangeRate,
    receiveAmount
  };
};
