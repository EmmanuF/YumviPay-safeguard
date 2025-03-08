
import { useState, useEffect } from 'react';
import { Country } from '../types/country';
import { countries as mockCountries } from '../data/countries';

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        // For now, we'll use mock data
        setCountries(mockCountries);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch countries'));
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const getCountryByCode = (code: string) => {
    return countries.find(country => country.code === code);
  };

  const getSendingCountries = () => {
    return countries.filter(country => country.isSendingEnabled);
  };

  const getReceivingCountries = () => {
    return countries.filter(country => country.isReceivingEnabled);
  };

  return {
    countries,
    isLoading,
    error,
    getCountryByCode,
    getSendingCountries,
    getReceivingCountries,
  };
}

// Re-export the types for easier imports
export type { Country, PaymentMethod } from '../types/country';
