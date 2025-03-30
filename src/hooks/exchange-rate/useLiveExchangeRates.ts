
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
  updateIntervalMs = 60000, // Default to 1 minute
  onRateUpdate
}: UseLiveExchangeRatesProps) => {
  const [rate, setRate] = useState<number>(initialRate);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [forcedRefresh, setForcedRefresh] = useState(false);

  // Function to fetch the latest exchange rate
  const updateRate = useCallback(async (forceRefresh = false) => {
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
      
      console.log(`📊 New exchange rate: 1 ${sourceCurrency} = ${newRate} ${targetCurrency}`);
      
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
      
      // Reset forced refresh state
      if (forceRefresh) {
        setForcedRefresh(false);
      }
    } catch (err) {
      console.error('Error updating exchange rate:', err);
      setError(err instanceof Error ? err : new Error('Failed to update exchange rate'));
      
      // Only show error toast on force refresh (user-initiated action)
      if (forceRefresh) {
        toast({
          title: `Failed to update exchange rate`,
          description: err instanceof Error ? err.message : 'Unknown error',
          variant: "destructive",
        });
        setForcedRefresh(false);
      }
      
      // Increment retry count for exponential backoff
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  }, [sourceCurrency, targetCurrency, rate, onRateUpdate]);

  // Update the rate when currencies change
  useEffect(() => {
    updateRate(true); // Force refresh when currencies change
  }, [sourceCurrency, targetCurrency, updateRate]);

  // Set up periodic updates with exponential backoff on errors
  useInterval(() => {
    // Use exponential backoff if we've had errors
    if (retryCount > 0) {
      const backoffTime = Math.min(updateIntervalMs * Math.pow(2, retryCount), 30 * 60 * 1000); // Max 30 minutes
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
    forcedRefresh
  };
};
