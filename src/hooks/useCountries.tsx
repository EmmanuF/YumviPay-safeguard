
import { useState, useEffect } from 'react';
import { Country } from '../types/country';
import { countries as mockCountries } from '../data/countries';
import { apiService } from '../services/apiService';
import { useNetwork } from '@/contexts/NetworkContext';

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isOffline } = useNetwork();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        
        if (!isOffline) {
          // Try to fetch from API if online
          try {
            const apiCountries = await apiService.countries.getAll();
            setCountries(apiCountries);
            setIsLoading(false);
            return;
          } catch (apiError) {
            console.error('Error fetching countries from API:', apiError);
            // Fall back to mock data on API error
          }
        }
        
        // Use mock data if offline or API error
        console.log('Using mock country data due to offline status or API error');
        setCountries(mockCountries);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch countries'));
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, [isOffline]);

  const getCountryByCode = (code: string) => {
    return countries.find(country => country.code === code);
  };

  const getSendingCountries = async () => {
    if (!isOffline) {
      try {
        return await apiService.countries.getSendingCountries();
      } catch (error) {
        console.error('Error fetching sending countries from API:', error);
        // Fall back to filtering local data
      }
    }
    
    return countries.filter(country => country.isSendingEnabled);
  };

  const getReceivingCountries = async () => {
    if (!isOffline) {
      try {
        return await apiService.countries.getReceivingCountries();
      } catch (error) {
        console.error('Error fetching receiving countries from API:', error);
        // Fall back to filtering local data
      }
    }
    
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
