
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
        
        // Always try API first to get fresh data
        setIsLoading(true);
        
        if (!isOffline) {
          // Try to fetch from Supabase if online
          console.log('🔍 HOOK: Attempting to fetch countries from API...');
          const apiData = await fetchCountriesFromApi();
          
          if (apiData && apiData.length > 0) {
            console.log('🔍 HOOK API: Successfully loaded', apiData.length, 'countries from API');
            
            // Apply centralized rules to API data
            const processedApiData = enforceCountryRulesForArray(apiData);
            
            // Debug sending countries
            const sendingCountries = processedApiData.filter(c => c.isSendingEnabled);
            console.log(`🔍 HOOK API: Found ${sendingCountries.length} sending countries`);
            if (sendingCountries.length > 0) {
              console.log('🔍 HOOK API: Sending countries:', sendingCountries.map(c => c.code).join(', '));
            } else {
              console.warn('🔍 HOOK API: No sending countries found after enforcement - check rules');
            }
            
            // Debug key countries from API
            logKeyCountriesStatus(processedApiData, 'HOOK API');
            
            updateCountriesCache(processedApiData);
            setCountries(processedApiData);
            setIsLoading(false);
            return;
          } else {
            console.log('🔍 HOOK: API returned no countries or failed, falling back to cache or mock data');
          }
        }
        
        // Try to use cached data if API failed or offline
        const cachedData = getCachedCountries();
        if (cachedData && cachedData.length > 0) {
          console.log('🔍 HOOK: Using cached countries data as fallback:', cachedData.length, 'countries');
          
          // Apply centralized rules to cached data
          const processedCachedData = enforceCountryRulesForArray(cachedData);
          
          // Debug key countries from cache
          logKeyCountriesStatus(processedCachedData, 'HOOK CACHE');
          
          setCountries(processedCachedData);
          setIsLoading(false);
          return;
        }
        
        // Use mock data as last resort
        console.log('🔍 HOOK: Using mock country data as last resort');
        
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
      
      // Check if sending countries are properly set
      const sendingCountries = countries.filter(c => c.isSendingEnabled);
      console.log(`🔍 HOOK STATE: Found ${sendingCountries.length} sending countries in state`);
      if (sendingCountries.length > 0) {
        console.log('🔍 HOOK STATE: Sending countries:', sendingCountries.map(c => c.code).join(', '));
      } else {
        console.warn('🔍 HOOK STATE: No sending countries found in state - check enforcement logic');
      }
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
      // Either filter from our current countries or use a dedicated API endpoint
      if (!isOffline) {
        try {
          // Try to get sending countries directly from API first
          const apiSendingCountries = await fetchSendingCountriesFromApi();
          if (apiSendingCountries && apiSendingCountries.length > 0) {
            // Apply rules to ensure correctness
            const processedSendingCountries = enforceCountryRulesForArray(apiSendingCountries);
            console.log(`🔍 HOOK SENDING API: Got ${processedSendingCountries.length} sending countries from API`);
            return processedSendingCountries;
          }
        } catch (err) {
          console.error('Error fetching sending countries from API:', err);
        }
      }
      
      // Fallback: filter from local countries
      const allCountries = countries.length > 0 ? countries : mockCountries;
      
      // Apply country rules and filter by our explicit sending country list
      const sendingCountries = enforceCountryRulesForArray(allCountries)
        .filter(country => SENDING_COUNTRIES.includes(country.code));
      
      console.log('🔍 HOOK SENDING: Filtered sending countries:',
        sendingCountries.map(c => c.name).join(', '));
      
      return sendingCountries;
    },
    [countries, isOffline]
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
