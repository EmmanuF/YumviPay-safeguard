
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
  const lastToastRef = useRef<string | null>(null);
  const calculationInProgressRef = useRef(false);
  
  // Create a key for tracking currency pair changes
  const currencyPairKey = `${sourceCurrency}-${targetCurrency}`;
  
  // Get initial rate based on currency pair for a better UX
  const getInitialRate = () => {
    if (sourceCurrency === targetCurrency) return 1;
    if (sourceCurrency === 'USD' && targetCurrency === 'XAF') return 610;
    if (sourceCurrency === 'EUR' && targetCurrency === 'XAF') return 655;
    return 0;
  };
  
  // Get live exchange rate updates - optimized for faster updates
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
    initialRate: getInitialRate(), // Use a sensible default rate
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
      
      // Force recalculation when we get a rate update
      calculateAmount(newRate);
    }
  });

  // Reset receive amount when currency pair changes
  useEffect(() => {
    console.log(`🔄 Currency pair changed to ${currencyPairKey}, resetting calculation`);
    // No need to empty the receive amount while calculating
    // Instead, we'll show a sensible default using fallback rates
    const initialRate = getInitialRate();
    if (initialRate > 0) {
      const amount = parseFloat(sendAmount) || 0;
      const converted = (amount * initialRate).toFixed(2);
      setReceiveAmount(converted);
    }
    
    // Trigger rate update on currency change
    updateRate();
  }, [currencyPairKey, updateRate]);

  // Calculate receive amount whenever input values change
  const calculateAmount = useCallback((forceRate?: number) => {
    // Use the forced rate if provided, otherwise use the current exchangeRate
    const rateToUse = forceRate !== undefined ? forceRate : exchangeRate;
    
    // Prevent multiple rapid recalculations that cause flickering
    if (calculationInProgressRef.current) {
      return;
    }
    
    console.log(`🧮 Calculating exchange rate from ${sourceCurrency} to ${targetCurrency} with rate ${rateToUse}`);
    calculationInProgressRef.current = true;
    
    try {
      // Handle zero exchange rate case
      if (rateToUse === 0 || isNaN(rateToUse)) {
        // Try to use a fallback rate based on currency pair
        let fallbackRate = 0;
        if (sourceCurrency === 'USD' && targetCurrency === 'XAF') {
          fallbackRate = 610;
        } else if (sourceCurrency === 'EUR' && targetCurrency === 'XAF') {
          fallbackRate = 655;
        } else if (sourceCurrency === targetCurrency) {
          fallbackRate = 1;
        }
        
        if (fallbackRate > 0) {
          // Calculate using the fallback rate
          const amount = parseFloat(sendAmount) || 0;
          const converted = (amount * fallbackRate).toFixed(2);
          setReceiveAmount(converted);
          console.log(`🔢 Using fallback rate: ${sendAmount} ${sourceCurrency} = ${converted} ${targetCurrency} (rate: ${fallbackRate})`);
        } else if (!isLoading) {
          console.log(`⚠️ Exchange rate is zero or NaN for ${sourceCurrency} to ${targetCurrency}, triggering update`);
          updateRate();
          setReceiveAmount('Calculating...');
        }
        calculationInProgressRef.current = false;
        return;
      }

      // Calculate the receive amount
      const amount = parseFloat(sendAmount) || 0;
      const converted = (amount * rateToUse).toFixed(2);
      setReceiveAmount(converted);
      console.log(`🔢 Receive amount calculated: ${sendAmount} ${sourceCurrency} = ${converted} ${targetCurrency} (rate: ${rateToUse})`);
      
      // Store the calculation details for comparison
      setLastCalculation(`${rateToUse}|${sendAmount}|${converted}`);
    } catch (err) {
      console.error("Error calculating exchange rate:", err);
      setReceiveAmount('Error');
    } finally {
      // Release the calculation lock after a small delay to prevent UI jitter
      setTimeout(() => {
        calculationInProgressRef.current = false;
      }, 50);
    }
  }, [sendAmount, sourceCurrency, targetCurrency, exchangeRate, isLoading, updateRate]);
  
  // Run calculation when dependencies change without debounce for immediate feedback
  useEffect(() => {
    calculateAmount();
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
      setTimeout(() => {
        lastToastRef.current = null;
      }, 5000);
    } else {
      console.log("Skipping duplicate refresh toast");
    }
  };

  return {
    exchangeRate: exchangeRate || 0,
    receiveAmount,
    isLoading,
    error,
    lastUpdated,
    refreshRate,
    rateLimitReached
  };
};
