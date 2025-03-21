
import { useState, useEffect } from 'react';
import { useCountries } from '@/hooks/useCountries';

type CurrencyType = 'source' | 'target';

interface UseCurrenciesOptions {
  type: CurrencyType;
}

interface UseCurrenciesResult {
  currencies: string[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to get a list of currencies based on type (source or target)
 */
export function useCurrencies({ type }: UseCurrenciesOptions): UseCurrenciesResult {
  const { countries, isLoading: countriesLoading } = useCountries();
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      if (!countriesLoading && countries.length > 0) {
        let filteredCountries;
        
        if (type === 'source') {
          filteredCountries = countries.filter(country => country.isSendingEnabled);
          // Fallback to default sending currencies if none are found
          if (filteredCountries.length === 0) {
            console.log('No sending countries found, using default list');
            setCurrencies(['USD', 'EUR', 'GBP', 'CAD']);
            setIsLoading(false);
            return;
          }
        } else {
          filteredCountries = countries.filter(country => country.isReceivingEnabled);
          // Fallback to default receiving currencies if none are found
          if (filteredCountries.length === 0) {
            console.log('No receiving countries found, using default list');
            setCurrencies(['XAF', 'NGN', 'GHS']);
            setIsLoading(false);
            return;
          }
        }

        // Extract unique currencies
        const uniqueCurrencies = Array.from(
          new Set(filteredCountries.map(country => country.currency))
        );

        setCurrencies(uniqueCurrencies);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error in useCurrencies:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setIsLoading(false);
    }
  }, [countries, countriesLoading, type]);

  return { currencies, isLoading, error };
}
