
import { useState, useEffect, useMemo } from 'react';
import { Country, PaymentMethod } from '../../types/country';
import { countries as mockCountries } from '../../data/countries';
import { useNetwork } from '@/contexts/network';
import { getCachedCountries, updateCountriesCache } from './countriesCache';
import { fetchCountriesFromApi, fetchSendingCountriesFromApi, fetchReceivingCountriesFromApi } from './countriesApi';

/**
 * Custom hook for managing countries data
 */
export function useCountries() {
  const [countries, setCountries] = useState<Country[]>(getCachedCountries() || []);
  const [isLoading, setIsLoading] = useState(!getCachedCountries());
  const [error, setError] = useState<Error | null>(null);
  const { isOffline } = useNetwork();

  useEffect(() => {
    const loadCountries = async () => {
      try {
        // Return cached data if it exists and is still valid
        const cachedData = getCachedCountries();
        if (cachedData) {
          setCountries(cachedData);
          setIsLoading(false);
          return;
        }
        
        setIsLoading(true);
        
        if (!isOffline) {
          // Try to fetch from Supabase if online
          const apiData = await fetchCountriesFromApi();
          
          if (apiData) {
            updateCountriesCache(apiData);
            setCountries(apiData);
            setIsLoading(false);
            return;
          }
        }
        
        // Use mock data if offline or API error
        console.log('Using mock country data due to offline status or API error');
        setCountries(mockCountries);
        
        // Update cache
        updateCountriesCache(mockCountries);
        
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch countries'));
        setIsLoading(false);
      }
    };

    loadCountries();
  }, [isOffline]);

  const getCountryByCode = useMemo(() => 
    (code: string) => countries.find(country => country.code === code),
    [countries]
  );

  const getSendingCountries = useMemo(() => 
    async () => {
      // If we already have countries data, filter it locally
      if (countries.length > 0) {
        return countries.filter(country => country.isSendingEnabled);
      }
      
      if (!isOffline) {
        const apiData = await fetchSendingCountriesFromApi();
        if (apiData) {
          return apiData;
        }
      }
      
      return mockCountries.filter(country => country.isSendingEnabled);
    },
    [countries, isOffline]
  );

  const getReceivingCountries = useMemo(() => 
    async () => {
      // If we already have countries data, filter it locally
      if (countries.length > 0) {
        return countries.filter(country => country.isReceivingEnabled);
      }
      
      if (!isOffline) {
        const apiData = await fetchReceivingCountriesFromApi();
        if (apiData) {
          return apiData;
        }
      }
      
      return mockCountries.filter(country => country.isReceivingEnabled);
    },
    [countries, isOffline]
  );

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
export type { Country, PaymentMethod } from '../../types/country';
