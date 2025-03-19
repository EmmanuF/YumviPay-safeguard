
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
        console.log('Loading countries data...');
        
        // Return cached data if it exists and is still valid
        const cachedData = getCachedCountries();
        if (cachedData && cachedData.length > 0) {
          console.log('Using cached countries data:', cachedData.length, 'countries');
          setCountries(cachedData);
          setIsLoading(false);
          return;
        }
        
        setIsLoading(true);
        
        if (!isOffline) {
          // Try to fetch from Supabase if online
          console.log('Attempting to fetch countries from API...');
          const apiData = await fetchCountriesFromApi();
          
          if (apiData && apiData.length > 0) {
            console.log('Successfully loaded', apiData.length, 'countries from API');
            updateCountriesCache(apiData);
            setCountries(apiData);
            setIsLoading(false);
            return;
          } else {
            console.log('API returned no countries or failed, falling back to mock data');
          }
        }
        
        // Use mock data if offline or API error
        console.log('Using mock country data due to offline status or API error');
        console.log('Mock data has', mockCountries.length, 'countries');
        
        // Log sending countries from mock data for debugging
        const sendingCountriesFromMock = mockCountries.filter(c => c.isSendingEnabled);
        console.log('Mock data has', sendingCountriesFromMock.length, 'sending countries:', 
                    sendingCountriesFromMock.map(c => c.code).join(', '));
        
        setCountries(mockCountries);
        
        // Update cache with mock data for future use
        updateCountriesCache(mockCountries);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading countries:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch countries'));
        
        // Even if there's an error, fall back to mock data
        console.log('Error occurred, using mock data as fallback');
        setCountries(mockCountries);
        
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
      console.log('Getting sending countries...');
      
      // If we already have countries data, filter it locally
      if (countries.length > 0) {
        const sendingCountries = countries.filter(country => country.isSendingEnabled);
        console.log('Filtered sending countries from loaded data:', sendingCountries.length);
        return sendingCountries;
      }
      
      if (!isOffline) {
        console.log('Attempting to fetch sending countries directly...');
        const apiData = await fetchSendingCountriesFromApi();
        if (apiData && apiData.length > 0) {
          console.log('Successfully loaded', apiData.length, 'sending countries from API');
          return apiData;
        } else {
          console.log('API returned no sending countries, falling back to mock data');
        }
      }
      
      const mockSendingCountries = mockCountries.filter(country => country.isSendingEnabled);
      console.log('Using mock sending countries:', mockSendingCountries.length);
      return mockSendingCountries;
    },
    [countries, isOffline]
  );

  const getReceivingCountries = useMemo(() => 
    async () => {
      console.log('Getting receiving countries...');
      
      // If we already have countries data, filter it locally
      if (countries.length > 0) {
        const receivingCountries = countries.filter(country => country.isReceivingEnabled);
        console.log('Filtered receiving countries from loaded data:', receivingCountries.length);
        return receivingCountries;
      }
      
      if (!isOffline) {
        console.log('Attempting to fetch receiving countries directly...');
        const apiData = await fetchReceivingCountriesFromApi();
        if (apiData && apiData.length > 0) {
          console.log('Successfully loaded', apiData.length, 'receiving countries from API');
          return apiData;
        } else {
          console.log('API returned no receiving countries, falling back to mock data');
        }
      }
      
      const mockReceivingCountries = mockCountries.filter(country => country.isReceivingEnabled);
      console.log('Using mock receiving countries:', mockReceivingCountries.length);
      return mockReceivingCountries;
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
