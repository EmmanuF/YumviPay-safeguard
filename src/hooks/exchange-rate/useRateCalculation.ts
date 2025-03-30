
import { useState, useEffect, useCallback } from 'react';
import { RateCalculationProps } from './types';
import { useLiveExchangeRates } from './useLiveExchangeRates';
import { toast } from '@/hooks/use-toast';

export const useRateCalculation = ({
  sendAmount,
  sourceCurrency,
  targetCurrency
}: RateCalculationProps) => {
  const [receiveAmount, setReceiveAmount] = useState('');
  const [lastCalculation, setLastCalculation] = useState<string | null>(null);
  
  // Get live exchange rate updates - reduced to 3 times per day (8 hours interval)
  const { 
    rate: exchangeRate, 
    isLoading,
    error,
    lastUpdated,
    updateRate,
    rateLimitReached
  } = useLiveExchangeRates({
    sourceCurrency,
    targetCurrency,
    initialRate: sourceCurrency === 'USD' && targetCurrency === 'XAF' ? 630 : 0, // Initial rate includes the 20 XAF markup
    updateIntervalMs: 28800000, // 8 hours = 3 updates per day
    onRateUpdate: (newRate) => {
      // Show toast when rate updates significantly (more than 1%)
      if (lastCalculation) {
        const [prevRate] = lastCalculation.split('|');
        const prevRateNum = parseFloat(prevRate);
        const rateChange = Math.abs((newRate - prevRateNum) / prevRateNum);
        
        if (rateChange > 0.01) {
          toast({
            title: "Exchange Rate Updated",
            description: `1 ${sourceCurrency} = ${newRate.toFixed(4)} ${targetCurrency}`,
            variant: "info",
          });
        }
      }
    }
  });

  // Calculate receive amount whenever input values change
  const calculateAmount = useCallback(() => {
    console.log("🧮 Calculating exchange rate from", sourceCurrency, "to", targetCurrency);
    
    try {
      if (isLoading && exchangeRate === 0) {
        // Don't update yet if we're still loading the initial rate
        return;
      }

      // Use the live rate from the API (which now includes the 20 XAF markup)
      console.log(`💱 Using exchange rate: 1 ${sourceCurrency} = ${exchangeRate} ${targetCurrency}`);
      
      // Calculate the receive amount
      const amount = parseFloat(sendAmount) || 0;
      const converted = (amount * exchangeRate).toFixed(2);
      setReceiveAmount(converted);
      console.log(`🔢 Receive amount calculated: ${sendAmount} ${sourceCurrency} = ${converted} ${targetCurrency}`);
      
      // Store the calculation details for comparison
      setLastCalculation(`${exchangeRate}|${sendAmount}|${converted}`);
    } catch (err) {
      console.error("Error calculating exchange rate:", err);
      setReceiveAmount('Error');
    }
  }, [sendAmount, sourceCurrency, targetCurrency, exchangeRate, isLoading]);
  
  // Run calculation when dependencies change
  useEffect(() => {
    calculateAmount();
  }, [calculateAmount]);

  // Function to force refresh the exchange rate
  const refreshRate = () => {
    updateRate();
    toast({
      title: "Refreshing Exchange Rate",
      description: rateLimitReached ? "API quota reached. Using cached rates." : "Getting the latest exchange rate...",
      variant: rateLimitReached ? "warning" : "default",
    });
  };

  return {
    exchangeRate,
    receiveAmount,
    isLoading,
    error,
    lastUpdated,
    refreshRate,
    rateLimitReached
  };
};
