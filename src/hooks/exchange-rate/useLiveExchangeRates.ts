
import { useState, useEffect, useCallback } from 'react';
import { useInterval } from '@/hooks/useInterval';
import { getExchangeRate } from '@/services/api/exchangeRateApi';

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

  // Function to fetch the latest exchange rate
  const updateRate = useCallback(async () => {
    if (!sourceCurrency || !targetCurrency) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`🔄 Updating exchange rate: ${sourceCurrency} to ${targetCurrency}`);
      const newRate = await getExchangeRate(sourceCurrency, targetCurrency);
      
      console.log(`📊 New exchange rate: 1 ${sourceCurrency} = ${newRate} ${targetCurrency}`);
      setRate(newRate);
      setLastUpdated(new Date());
      
      if (onRateUpdate) {
        onRateUpdate(newRate);
      }
    } catch (err) {
      console.error('Error updating exchange rate:', err);
      setError(err instanceof Error ? err : new Error('Failed to update exchange rate'));
    } finally {
      setIsLoading(false);
    }
  }, [sourceCurrency, targetCurrency, onRateUpdate]);

  // Update the rate when currencies change
  useEffect(() => {
    updateRate();
  }, [sourceCurrency, targetCurrency, updateRate]);

  // Set up periodic updates
  useInterval(() => {
    updateRate();
  }, updateIntervalMs);

  return {
    rate,
    lastUpdated,
    isLoading,
    error,
    updateRate
  };
};
