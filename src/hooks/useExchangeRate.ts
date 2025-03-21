
import { useState, useEffect } from 'react';
import { getExchangeRate } from '@/data/exchangeRates';

interface UseExchangeRateResult {
  exchangeRate: number;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to get the exchange rate between two currencies
 * @param sourceCurrency The source currency code
 * @param targetCurrency The target currency code
 * @returns The exchange rate, loading state, and any error
 */
export function useExchangeRate(
  sourceCurrency: string, 
  targetCurrency: string
): UseExchangeRateResult {
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      const fetchRate = () => {
        try {
          const rate = getExchangeRate(sourceCurrency, targetCurrency);
          
          if (!rate || rate === 1) {
            console.log(`Rate not found for ${sourceCurrency}-${targetCurrency}, checking reverse pair`);
            // If direct pair not found, try to invert the reverse pair if it exists
            const reversePair = getExchangeRate(targetCurrency, sourceCurrency);
            if (reversePair && reversePair !== 1) {
              setExchangeRate(1 / reversePair);
            } else {
              setExchangeRate(rate);
            }
          } else {
            setExchangeRate(rate);
          }
          
          setIsLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to fetch exchange rate'));
          setIsLoading(false);
        }
      };
      
      // Add slight delay to simulate API call for better UX
      const timer = setTimeout(fetchRate, 300);
      
      return () => clearTimeout(timer);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setIsLoading(false);
    }
  }, [sourceCurrency, targetCurrency]);

  return { exchangeRate, isLoading, error };
}
