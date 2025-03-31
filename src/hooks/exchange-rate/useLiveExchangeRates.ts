
import { useState, useEffect, useCallback, useRef } from 'react';
import { useInterval } from '@/hooks/useInterval';
import { getExchangeRate, refreshExchangeRates } from '@/services/api/exchangeRate';
import { toast } from '@/hooks/use-toast';

export interface UseLiveExchangeRatesProps {
  sourceCurrency: string;
  targetCurrency: string;
  initialRate?: number;
  updateIntervalMs?: number;
  onRateUpdate?: (rate: number) => void;
}

export const useLiveExchangeRates = ({
  sourceCurrency,
  targetCurrency,
  initialRate = 0,
  updateIntervalMs = 28800000, // 8 hours interval (3 updates per day)
  onRateUpdate
}: UseLiveExchangeRatesProps) => {
  // Initialize with a fallback rate based on the currency pair
  const getInitialRate = () => {
    if (sourceCurrency === targetCurrency) return 1;
    if (sourceCurrency === 'USD' && targetCurrency === 'XAF') return 610;
    if (sourceCurrency === 'EUR' && targetCurrency === 'XAF') return 655;
    return initialRate;
  };
  
  const [rate, setRate] = useState<number>(getInitialRate());
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date()); // Initialize with current time
  const [isLoading, setIsLoading] = useState(false); // Start as NOT loading for better UX
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [forcedRefresh, setForcedRefresh] = useState(false);
  const [rateLimitReached, setRateLimitReached] = useState(false);
  
  // Add a key state that changes when source or target currency changes
  const currencyPairKey = `${sourceCurrency}-${targetCurrency}`;
  
  // Track if component is mounted
  const isMounted = useRef(true);
  
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Function to fetch the latest exchange rate
  const updateRate = useCallback(async (forceRefresh = false) => {
    // Skip if currencies aren't set
    if (!sourceCurrency || !targetCurrency) {
      return;
    }
    
    // If source and target are the same, rate is always 1
    if (sourceCurrency === targetCurrency) {
      setRate(1);
      setLastUpdated(new Date());
      setIsLoading(false);
      return;
    }
    
    // Skip update if component unmounted
    if (!isMounted.current) {
      return;
    }

    try {
      // Set loading state immediately
      setIsLoading(true);
      setError(null);
      
      if (forceRefresh) {
        setForcedRefresh(true);
      }
      
      console.log(`🔄 Updating exchange rate: ${sourceCurrency} to ${targetCurrency}${forceRefresh ? ' (force refresh)' : ''}`);
      
      // If forcing a refresh or currency has changed, clear cache and get new data
      let newRate: number;
      if (forceRefresh) {
        try {
          // Force refresh the rates for this currency
          console.log(`🔄 Force refreshing exchange rates for ${sourceCurrency}`);
          await refreshExchangeRates(sourceCurrency);
          newRate = await getExchangeRate(sourceCurrency, targetCurrency);
        } catch (refreshError) {
          console.error('❌ Forced refresh failed:', refreshError);
          // Fall back to regular fetch if force fails
          newRate = await getExchangeRate(sourceCurrency, targetCurrency);
        }
      } else {
        newRate = await getExchangeRate(sourceCurrency, targetCurrency);
      }
      
      // Verify we have a valid rate, otherwise use fallback
      if (!newRate || isNaN(newRate) || newRate === 0) {
        // Use fallback rates for common pairs
        if (sourceCurrency === 'USD' && targetCurrency === 'XAF') {
          newRate = 610;
        } else if (sourceCurrency === 'EUR' && targetCurrency === 'XAF') {
          newRate = 655;
        }
      }
      
      // Add 20 XAF markup for XAF currency
      if (targetCurrency === 'XAF' && newRate > 0) {
        newRate += 20;
        console.log(`📊 Added 20 XAF markup. New rate: 1 ${sourceCurrency} = ${newRate} ${targetCurrency}`);
      } 
      
      // Check if rate actually changed
      const hasRateChanged = rate !== newRate;
      
      // Always update the rate to ensure we get the latest value
      if (isMounted.current && newRate > 0) {
        setRate(newRate);
        setLastUpdated(new Date());
      }
      
      // Only show toast if rate has actually changed and it was a forced refresh
      if (hasRateChanged && forceRefresh) {
        toast({
          title: `Exchange Rate Updated`,
          description: `1 ${sourceCurrency} = ${newRate.toFixed(4)} ${targetCurrency}`,
          variant: "default",
        });
      }
      
      if (onRateUpdate && hasRateChanged) {
        onRateUpdate(newRate);
      }
      
      // Reset retry count on success
      if (isMounted.current) {
        setRetryCount(0);
        setRateLimitReached(false); // Reset rate limit flag on successful call
        
        // Reset forced refresh state
        if (forceRefresh) {
          setForcedRefresh(false);
        }
      }
    } catch (err) {
      if (!isMounted.current) return;
      
      console.error('Error updating exchange rate:', err);
      setError(err instanceof Error ? err : new Error('Failed to update exchange rate'));
      
      // Check if error is related to rate limiting
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (errorMessage.includes('rate limit') || errorMessage.includes('quota') || errorMessage.includes('429')) {
        setRateLimitReached(true);
        console.warn('⚠️ API rate limit reached. Using fallback rates.');
        
        if (forceRefresh) {
          toast({
            title: `API Rate Limit Reached`,
            description: `Using cached data. New rates will be available when the quota resets.`,
            variant: "warning",
          });
        }
        
        // Use fallback rates for common pairs
        let fallbackRate = 0;
        if (sourceCurrency === 'USD' && targetCurrency === 'XAF') {
          fallbackRate = 610;
        } else if (sourceCurrency === 'EUR' && targetCurrency === 'XAF') {
          fallbackRate = 655;
        }
        
        if (fallbackRate > 0) {
          setRate(fallbackRate);
          setLastUpdated(new Date());
        }
      } else if (forceRefresh) {
        // Only show error toast on force refresh (user-initiated action)
        toast({
          title: `Failed to update exchange rate`,
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      // Increment retry count for exponential backoff
      setRetryCount(prev => prev + 1);
      
      // Reset forced refresh state in case of error
      if (forceRefresh) {
        setForcedRefresh(false);
      }
    } finally {
      // Release the loading state
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [sourceCurrency, targetCurrency, rate, onRateUpdate]);

  // Reset rate when currency pair changes to avoid showing the previous rate
  useEffect(() => {
    // When currency pair changes, reset the rate to force a new calculation
    if (isMounted.current) {
      // Don't set rate to 0, use a sensible default
      if (sourceCurrency === 'USD' && targetCurrency === 'XAF') {
        setRate(610); // Default USD to XAF rate
      } else if (sourceCurrency === 'EUR' && targetCurrency === 'XAF') {
        setRate(655); // Default EUR to XAF rate
      } else if (sourceCurrency === targetCurrency) {
        setRate(1); // Same currency always has rate of 1
      }
      
      setIsLoading(true);
      console.log(`🔄 Currency pair changed to ${currencyPairKey}, updating rate`);
      
      // Cancel any scheduled updates and trigger a new one immediately
      const timer = setTimeout(() => {
        updateRate(true);
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [currencyPairKey, updateRate]);

  // Trigger an update whenever currency changes - this is critical for instant updates
  useEffect(() => {
    // Check for real currency changes to avoid unnecessary calls
    if (sourceCurrency && targetCurrency) {
      console.log(`🔄 Currency changed: ${sourceCurrency} to ${targetCurrency}, triggering immediate rate update`);
      
      // Set loading state immediately to show user something is happening
      if (isMounted.current) {
        setIsLoading(true);
      }
      
      // Immediately fetch the updated rate without delay
      updateRate(true);
    }
  }, [sourceCurrency, targetCurrency, updateRate]);

  // Set up periodic updates with exponential backoff on errors
  useInterval(() => {
    // Skip if rate limited or during active loading
    if (rateLimitReached || isLoading) {
      return;
    }
    
    // Use exponential backoff if we've had errors
    if (retryCount > 0) {
      const backoffTime = Math.min(updateIntervalMs * Math.pow(2, retryCount), 24 * 60 * 60 * 1000); // Max 24 hours
      console.log(`⏱️ Backing off exchange rate update for ${Math.round(backoffTime / 1000)}s due to previous errors`);
      return;
    }
    
    // Perform the periodic update
    console.log('⏱️ Performing scheduled exchange rate update');
    updateRate();
  }, updateIntervalMs);

  return {
    rate,
    lastUpdated,
    isLoading,
    error,
    updateRate: () => updateRate(true), // Expose function to force refresh
    retryCount,
    forcedRefresh,
    rateLimitReached
  };
};
