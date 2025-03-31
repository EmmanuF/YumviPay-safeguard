
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const currencyChangeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastToastRef = useRef<string | null>(null);
  const calculationInProgressRef = useRef(false);
  
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
    initialRate: 0, // Don't hardcode initial rate - removed fixed USD-XAF rate
    updateIntervalMs: 28800000, // 8 hours = 3 updates per day
    onRateUpdate: (newRate) => {
      // Only show toast when rate updates significantly (more than 1%)
      if (lastCalculation) {
        const [prevRate] = lastCalculation.split('|');
        const prevRateNum = parseFloat(prevRate);
        const rateChange = Math.abs((newRate - prevRateNum) / prevRateNum);
        
        // Only show toast for significant changes (> 1%)
        if (rateChange > 0.01) {
          const toastKey = `${sourceCurrency}-${targetCurrency}-${Math.round(newRate * 100)}`;
          
          // Prevent duplicate toasts within a short period
          if (lastToastRef.current !== toastKey) {
            toast({
              title: "Exchange Rate Updated",
              description: `1 ${sourceCurrency} = ${newRate.toFixed(4)} ${targetCurrency}`,
              variant: "info",
            });
            
            lastToastRef.current = toastKey;
          }
        }
      }
    }
  });

  // Clear any pending currency change timer when currencies change
  useEffect(() => {
    if (currencyChangeTimerRef.current) {
      clearTimeout(currencyChangeTimerRef.current);
    }
    
    // Reset last toast reference when currencies change
    lastToastRef.current = null;
    
    // Force update the rate when currency changes
    updateRate();
    
    return () => {
      if (currencyChangeTimerRef.current) {
        clearTimeout(currencyChangeTimerRef.current);
      }
    };
  }, [sourceCurrency, targetCurrency, updateRate]);

  // Calculate receive amount whenever input values change
  const calculateAmount = useCallback(() => {
    // Prevent multiple rapid recalculations
    if (calculationInProgressRef.current) {
      return;
    }
    
    console.log("🧮 Calculating exchange rate from", sourceCurrency, "to", targetCurrency);
    calculationInProgressRef.current = true;
    
    try {
      if (isLoading && exchangeRate === 0) {
        // Don't update yet if we're still loading the initial rate
        calculationInProgressRef.current = false;
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
    } finally {
      // Release the calculation lock after a small delay to prevent UI jitter
      setTimeout(() => {
        calculationInProgressRef.current = false;
      }, 100);
    }
  }, [sendAmount, sourceCurrency, targetCurrency, exchangeRate, isLoading]);
  
  // Run calculation when dependencies change with a slight debounce
  useEffect(() => {
    // Clear any existing timer
    if (currencyChangeTimerRef.current) {
      clearTimeout(currencyChangeTimerRef.current);
    }
    
    // Set a short timeout to debounce rapid changes
    currencyChangeTimerRef.current = setTimeout(() => {
      calculateAmount();
    }, 50);
    
    return () => {
      if (currencyChangeTimerRef.current) {
        clearTimeout(currencyChangeTimerRef.current);
      }
    };
  }, [calculateAmount]);

  // Function to force refresh the exchange rate
  const refreshRate = () => {
    // Check if we've shown a toast recently for this currency pair
    const currentKey = `${sourceCurrency}-${targetCurrency}-refresh`;
    
    if (lastToastRef.current !== currentKey) {
      updateRate();
      
      toast({
        title: "Refreshing Exchange Rate",
        description: rateLimitReached ? "API quota reached. Using cached rates." : "Getting the latest exchange rate...",
        variant: rateLimitReached ? "warning" : "default",
      });
      
      // Remember this toast to prevent duplicates
      lastToastRef.current = currentKey;
      
      // Reset the toast reference after 5 seconds
      currencyChangeTimerRef.current = setTimeout(() => {
        lastToastRef.current = null;
      }, 5000);
    } else {
      console.log("Skipping duplicate refresh toast");
    }
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
