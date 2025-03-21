
import { useState, useEffect, useMemo } from 'react';
import { Country, PaymentMethod } from '../../types/country';
import { countries as mockCountries } from '../../data/countries';
import { useNetwork } from '@/contexts/network';
import { getCachedCountries, updateCountriesCache, clearCountriesCache } from './countriesCache';
import { fetchCountriesFromApi, fetchSendingCountriesFromApi, fetchReceivingCountriesFromApi } from './countriesApi';
import { enforceClientCountryRules, SENDING_COUNTRIES } from '@/utils/countries/countryRules';
import { logCountryDiagnostics } from '@/utils/countries/diagnostics';

/**
 * Custom hook for managing countries data
 * Updated to use the centralized country rules
 */
export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isOffline } = useNetwork();

  // Clear the cache on first load to ensure fresh data
  useEffect(() => {
    const initialize = async () => {
      console.log('🔍 HOOK: Initializing countries hook...');
      
      try {
        setIsLoading(true);
        
        // Return cached data if it exists and is still valid
        const cachedData = getCachedCountries();
        if (cachedData && cachedData.length > 0) {
          console.log('🔍 HOOK: Using cached countries data:', cachedData.length, 'countries');
          
          // Apply rules to cached data for consistency
          const processedData = cachedData.map(enforceClientCountryRules);
          
          // Log diagnostics
          logCountryDiagnostics(processedData, 'CACHE');
          
          setCountries(processedData);
          setIsLoading(false);
          return;
        }
        
        if (!isOffline) {
          // Try to fetch from Supabase if online
          console.log('🔍 HOOK: Attempting to fetch countries from API...');
          const apiData = await fetchCountriesFromApi();
          
          if (apiData && apiData.length > 0) {
            console.log('🔍 HOOK API: Successfully loaded', apiData.length, 'countries from API');
            
            // Log diagnostics
            logCountryDiagnostics(apiData, 'API');
            
            updateCountriesCache(apiData);
            setCountries(apiData);
            setIsLoading(false);
            return;
          } else {
            console.log('🔍 HOOK: API returned no countries or failed, falling back to mock data');
          }
        }
        
        // Use mock data if offline or API error
        console.log('🔍 HOOK: Using mock country data due to offline status or API error');
        
        // Apply rules to mock data
        const processedMockData = mockCountries.map(enforceClientCountryRules);
        
        // Log diagnostics
        logCountryDiagnostics(processedMockData, 'MOCK');
        
        updateCountriesCache(processedMockData);
        setCountries(processedMockData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading countries:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch countries'));
        
        // Even if there's an error, fall back to mock data
        console.log('🔍 HOOK ERROR: Error occurred, using mock data as fallback');
        
        // Apply rules to mock data
        const processedMockData = mockCountries.map(enforceClientCountryRules);
        
        updateCountriesCache(processedMockData);
        setCountries(processedMockData);
        setIsLoading(false);
      }
    };

    initialize();
  }, [isOffline]);

  const getCountryByCode = useMemo(() => 
    (code: string) => countries.find(country => country.code === code),
    [countries]
  );

  // Get sending countries based on enforced rules
  const getSendingCountries = useMemo(() => 
    async () => {
      console.log('🔍 HOOK: Getting sending countries...');
      
      if (countries.length > 0) {
        // Filter countries that have sending enabled after rule enforcement
        const sendingCountries = countries.filter(country => country.isSendingEnabled);
        
        // Log diagnostics
        logCountryDiagnostics(sendingCountries, 'SENDING COUNTRIES');
        
        return sendingCountries;
      }
      
      if (!isOffline) {
        try {
          const apiSendingCountries = await fetchSendingCountriesFromApi();
          if (apiSendingCountries && apiSendingCountries.length > 0) {
            return apiSendingCountries;
          }
        } catch (error) {
          console.error('Error fetching sending countries from API:', error);
        }
      }
      
      // Fallback to mock data
      const mockSendingCountries = mockCountries
        .map(enforceClientCountryRules)
        .filter(country => country.isSendingEnabled);
      
      return mockSendingCountries;
    },
    [countries, isOffline]
  );

  // Get receiving countries based on enforced rules
  const getReceivingCountries = useMemo(() => 
    async () => {
      console.log('🔍 HOOK: Getting receiving countries...');
      
      if (countries.length > 0) {
        // Filter countries that have receiving enabled after rule enforcement
        const receivingCountries = countries.filter(country => country.isReceivingEnabled);
        
        // Log diagnostics
        logCountryDiagnostics(receivingCountries, 'RECEIVING COUNTRIES');
        
        return receivingCountries;
      }
      
      if (!isOffline) {
        try {
          const apiReceivingCountries = await fetchReceivingCountriesFromApi();
          if (apiReceivingCountries && apiReceivingCountries.length > 0) {
            return apiReceivingCountries;
          }
        } catch (error) {
          console.error('Error fetching receiving countries from API:', error);
        }
      }
      
      // Fallback to mock data
      const mockReceivingCountries = mockCountries
        .map(enforceClientCountryRules)
        .filter(country => country.isReceivingEnabled);
      
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
