
import { useState, useEffect, useCallback } from 'react';
import { useInterval } from '@/hooks/useInterval';
import { getExchangeRate, refreshExchangeRates } from '@/services/api/exchangeRateApi';

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

  // Function to fetch the latest exchange rate
  const updateRate = useCallback(async (forceRefresh = false) => {
    if (!sourceCurrency || !targetCurrency) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
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
      
      // Always update the rate to ensure we get the latest value
      setRate(newRate);
      setLastUpdated(new Date());
      
      if (onRateUpdate) {
        onRateUpdate(newRate);
      }
      
      // Reset retry count on success
      setRetryCount(0);
    } catch (err) {
      console.error('Error updating exchange rate:', err);
      setError(err instanceof Error ? err : new Error('Failed to update exchange rate'));
      
      // Increment retry count for exponential backoff
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  }, [sourceCurrency, targetCurrency, onRateUpdate]);

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
    retryCount
  };
};
