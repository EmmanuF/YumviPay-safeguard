
import { useState, useEffect } from 'react';
import { RateCalculationProps } from './types';

export const useRateCalculation = ({
  sendAmount,
  sourceCurrency,
  targetCurrency
}: RateCalculationProps) => {
  const [exchangeRate, setExchangeRate] = useState(610);
  const [receiveAmount, setReceiveAmount] = useState('');

  // Calculate receive amount whenever input values change
  useEffect(() => {
    console.log("🧮 Calculating exchange rate from", sourceCurrency, "to", targetCurrency);
    
    try {
      // For MVP, using fixed rates for common currency pairs with Cameroon
      let rate = 610; // Default USD to XAF rate
      
      if (sourceCurrency === 'USD' && targetCurrency === 'XAF') {
        rate = 610;
      } else if (sourceCurrency === 'EUR' && targetCurrency === 'XAF') {
        rate = 655.957;
      } else if (sourceCurrency === 'GBP' && targetCurrency === 'XAF') {
        rate = 765.55;
      } else {
        // For other currencies, use a simplified calculation for demo
        const baseRate = 610;
        const sourceMultiplier = sourceCurrency === 'USD' ? 1 : 
                                 sourceCurrency === 'EUR' ? 1.05 : 
                                 sourceCurrency === 'GBP' ? 1.25 : 0.9;
        const targetMultiplier = targetCurrency === 'XAF' ? 1 :
                                 targetCurrency === 'NGN' ? 0.6 :
                                 targetCurrency === 'KES' ? 0.1 : 0.8;
        rate = baseRate * (targetMultiplier / sourceMultiplier);
      }
      
      setExchangeRate(rate);
      console.log(`💱 Exchange rate set: 1 ${sourceCurrency} = ${rate} ${targetCurrency}`);
      
      // Calculate the receive amount
      const amount = parseFloat(sendAmount) || 0;
      const converted = (amount * rate).toFixed(2);
      setReceiveAmount(converted);
      console.log(`🔢 Receive amount calculated: ${sendAmount} ${sourceCurrency} = ${converted} ${targetCurrency}`);
    } catch (error) {
      console.error("Error calculating exchange rate:", error);
      setReceiveAmount('Error');
    }
  }, [sendAmount, sourceCurrency, targetCurrency]);

  return {
    exchangeRate,
    receiveAmount
  };
};
