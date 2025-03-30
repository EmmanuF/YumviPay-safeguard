
import { useState, useEffect, useCallback } from 'react';
import { useInterval } from '@/hooks/useInterval';
import { getExchangeRate, refreshExchangeRates } from '@/services/api/exchangeRateApi';
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
  updateIntervalMs = 28800000, // Changed to 8 hours (28800000ms) for 3 updates per day
  onRateUpdate
}: UseLiveExchangeRatesProps) => {
  const [rate, setRate] = useState<number>(initialRate);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [forcedRefresh, setForcedRefresh] = useState(false);
  const [rateLimitReached, setRateLimitReached] = useState(false);

  // Function to fetch the latest exchange rate
  const updateRate = useCallback(async (forceRefresh = false) => {
    // If rate limit reached, only allow manual refreshes
    if (rateLimitReached && !forceRefresh) {
      console.log('⚠️ API rate limit reached. Skipping automatic update.');
      return;
    }

    if (!sourceCurrency || !targetCurrency) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      if (forceRefresh) {
        setForcedRefresh(true);
      }
      
      console.log(`🔄 Updating exchange rate: ${sourceCurrency} to ${targetCurrency}${forceRefresh ? ' (force refresh)' : ''}`);
      
      // If forcing a refresh, clear cache and get new data
      let newRate: number;
      if (forceRefresh) {
        // Force refresh the rates for this currency
        await refreshExchangeRates(sourceCurrency);
        newRate = await getExchangeRate(sourceCurrency, targetCurrency);
      } else {
        newRate = await getExchangeRate(sourceCurrency, targetCurrency);
      }
      
      // Add 20 XAF markup for XAF currency
      if (targetCurrency === 'XAF') {
        newRate += 20;
        console.log(`📊 Added 20 XAF markup. New rate: 1 ${sourceCurrency} = ${newRate} ${targetCurrency}`);
      } else {
        console.log(`📊 New exchange rate: 1 ${sourceCurrency} = ${newRate} ${targetCurrency}`);
      }
      
      // Check if rate actually changed
      const hasRateChanged = rate !== newRate;
      
      // Always update the rate to ensure we get the latest value
      setRate(newRate);
      setLastUpdated(new Date());
      
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
      setRetryCount(0);
      setRateLimitReached(false); // Reset rate limit flag on successful call
      
      // Reset forced refresh state
      if (forceRefresh) {
        setForcedRefresh(false);
      }
    } catch (err) {
      console.error('Error updating exchange rate:', err);
      setError(err instanceof Error ? err : new Error('Failed to update exchange rate'));
      
      // Check if error is related to rate limiting
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (errorMessage.includes('rate limit') || errorMessage.includes('quota') || errorMessage.includes('429')) {
        setRateLimitReached(true);
        console.warn('⚠️ API rate limit reached. Automatic updates disabled.');
      }
      
      // Only show error toast on force refresh (user-initiated action)
      if (forceRefresh) {
        toast({
          title: `Failed to update exchange rate`,
          description: errorMessage,
          variant: "destructive",
        });
        setForcedRefresh(false);
      }
      
      // Increment retry count for exponential backoff
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  }, [sourceCurrency, targetCurrency, rate, onRateUpdate, rateLimitReached]);

  // Update the rate when currencies change, but don't force refresh
  // to respect API limits - just use cached data if available
  useEffect(() => {
    // Only make a single API call when currencies change, don't force refresh
    updateRate(false); 
  }, [sourceCurrency, targetCurrency, updateRate]);

  // Set up periodic updates with exponential backoff on errors 
  // and respect for rate limits
  useInterval(() => {
    // If rate limited, skip automatic updates
    if (rateLimitReached) {
      console.log('⚠️ Skipping automatic update due to API rate limits');
      return;
    }
    
    // Use exponential backoff if we've had errors
    if (retryCount > 0) {
      const backoffTime = Math.min(updateIntervalMs * Math.pow(2, retryCount), 24 * 60 * 60 * 1000); // Max 24 hours
      console.log(`⏱️ Backing off exchange rate update for ${Math.round(backoffTime / 1000)}s due to previous errors`);
      return;
    }
    
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
