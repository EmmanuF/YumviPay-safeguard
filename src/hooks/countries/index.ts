
import { useState, useEffect, useMemo } from 'react';
import { Country, PaymentMethod } from '../../types/country';
import { countries as mockCountries } from '../../data/countries';
import { useNetwork } from '@/contexts/network';
import { getCachedCountries, updateCountriesCache, clearCountriesCache } from './countriesCache';
import { fetchCountriesFromApi, fetchSendingCountriesFromApi, fetchReceivingCountriesFromApi } from './countriesApi';
import { 
  enforceCountryRulesForArray, 
  SENDING_COUNTRIES,
  logKeyCountriesStatus 
} from '@/utils/countryRules';

/**
 * Custom hook for managing countries data
 */
export function useCountries() {
  const [countries, setCountries] = useState<Country[]>(enforceCountryRulesForArray(getCachedCountries() || []));
  const [isLoading, setIsLoading] = useState(!getCachedCountries());
  const [error, setError] = useState<Error | null>(null);
  const { isOffline } = useNetwork();

  // Clear the cache on first load to ensure fresh data
  useEffect(() => {
    console.log('🔍 HOOK: Clearing countries cache on initial load to ensure fresh data');
    clearCountriesCache();
  }, []);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        console.log('🔍 HOOK: Loading countries data...');
        
        // Return cached data if it exists and is still valid
        const cachedData = getCachedCountries();
        if (cachedData && cachedData.length > 0) {
          console.log('🔍 HOOK: Using cached countries data:', cachedData.length, 'countries');
          
          // Apply centralized rules to cached data
          const processedCachedData = enforceCountryRulesForArray(cachedData);
          
          // Debug key countries from cache
          logKeyCountriesStatus(processedCachedData, 'HOOK CACHE');
          
          setCountries(processedCachedData);
          setIsLoading(false);
          return;
        }
        
        setIsLoading(true);
        
        if (!isOffline) {
          // Try to fetch from Supabase if online
          console.log('🔍 HOOK: Attempting to fetch countries from API...');
          const apiData = await fetchCountriesFromApi();
          
          if (apiData && apiData.length > 0) {
            console.log('🔍 HOOK API: Successfully loaded', apiData.length, 'countries from API');
            
            // Apply centralized rules to API data
            const processedApiData = enforceCountryRulesForArray(apiData);
            
            // Debug key countries from API
            logKeyCountriesStatus(processedApiData, 'HOOK API');
            
            updateCountriesCache(processedApiData);
            setCountries(processedApiData);
            setIsLoading(false);
            return;
          } else {
            console.log('🔍 HOOK: API returned no countries or failed, falling back to mock data');
          }
        }
        
        // Use mock data if offline or API error
        console.log('🔍 HOOK: Using mock country data due to offline status or API error');
        
        // Apply centralized rules to mock data
        const processedMockData = enforceCountryRulesForArray(mockCountries);
        
        // Debug key countries from mock data
        logKeyCountriesStatus(processedMockData, 'HOOK MOCK');
        
        setCountries(processedMockData);
        
        // Update cache with processed mock data
        console.log('🔍 HOOK: Updating cache with processed mock data');
        updateCountriesCache(processedMockData);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading countries:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch countries'));
        
        // Even if there's an error, fall back to mock data
        console.log('🔍 HOOK ERROR: Error occurred, using mock data as fallback');
        
        // Apply centralized rules to mock data
        const processedMockData = enforceCountryRulesForArray(mockCountries);
        
        setCountries(processedMockData);
        setIsLoading(false);
      }
    };

    loadCountries();
  }, [isOffline]);

  // Add extra debugging to investigate what's happening with countries
  useEffect(() => {
    if (countries.length > 0) {
      // After countries are set in state, log their status
      logKeyCountriesStatus(countries, 'HOOK STATE');
    }
  }, [countries]);

  const getCountryByCode = useMemo(() => 
    (code: string) => countries.find(country => country.code === code),
    [countries]
  );

  // DIRECT IMPLEMENTATION for getSendingCountries - use our centralized SENDING_COUNTRIES constant
  const getSendingCountries = useMemo(() => 
    async () => {
      console.log('🔍 HOOK: Getting sending countries - DIRECT IMPLEMENTATION');
      
      // Make sure all countries in the SENDING_COUNTRIES array are included
      const allCountries = countries.length > 0 ? countries : mockCountries;
      
      // Apply country rules and filter by our explicit sending country list
      const sendingCountries = enforceCountryRulesForArray(allCountries)
        .filter(country => SENDING_COUNTRIES.includes(country.code));
      
      console.log('🔍 HOOK SENDING: Filtered sending countries:',
        sendingCountries.map(c => c.name).join(', '));
      
      return sendingCountries;
    },
    [countries]
  );

  const getReceivingCountries = useMemo(() => 
    async () => {
      console.log('🔍 HOOK: Getting receiving countries...');
      
      // If we already have countries data, filter it locally and enforce rules
      if (countries.length > 0) {
        // Filter AFTER enforcing rules to ensure consistency
        const filteredCountries = enforceCountryRulesForArray(countries);
        const receivingCountries = filteredCountries.filter(country => country.isReceivingEnabled);
        
        console.log('🔍 HOOK RECEIVING: Filtered receiving countries:', receivingCountries.map(c => c.name).join(', '));
        return receivingCountries;
      }
      
      if (!isOffline) {
        console.log('🔍 HOOK: Attempting to fetch receiving countries directly...');
        const apiData = await fetchReceivingCountriesFromApi();
        if (apiData && apiData.length > 0) {
          // Apply centralized rules to API data
          const processedApiData = enforceCountryRulesForArray(apiData);
          const receivingCountries = processedApiData.filter(country => country.isReceivingEnabled);
          
          console.log('🔍 HOOK API RECEIVING: Successfully loaded receiving countries:', receivingCountries.map(c => c.name).join(', '));
          return receivingCountries;
        } else {
          console.log('🔍 HOOK: API returned no receiving countries, falling back to mock data');
        }
      }
      
      // Process mock data with centralized rules
      const processedMockData = enforceCountryRulesForArray(mockCountries);
      const mockReceivingCountries = processedMockData.filter(country => country.isReceivingEnabled);
      
      console.log('🔍 HOOK MOCK RECEIVING: Using mock receiving countries:', mockReceivingCountries.map(c => c.name).join(', '));
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
