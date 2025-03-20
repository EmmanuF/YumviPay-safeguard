
import { useState, useEffect, useMemo } from 'react';
import { Country, PaymentMethod } from '../../types/country';
import { countries as mockCountries } from '../../data/countries';
import { useNetwork } from '@/contexts/network';
import { getCachedCountries, updateCountriesCache, clearCountriesCache } from './countriesCache';
import { fetchCountriesFromApi, fetchSendingCountriesFromApi, fetchReceivingCountriesFromApi } from './countriesApi';

// Define constant arrays of country codes to ensure proper flags
const AFRICAN_COUNTRY_CODES = ['CM', 'GH', 'NG', 'SN', 'CI', 'BJ', 'TG', 'BF', 'ML', 'NE', 'GW', 'GN', 'SL', 'LR', 'CD', 'GA', 'TD', 'CF', 'CG', 'GQ'];
const RECEIVING_ONLY_COUNTRIES = [...AFRICAN_COUNTRY_CODES]; // All African countries are receiving only

// Define sending countries explicitly
const SENDING_COUNTRIES = [
  // North America
  'US', 'CA', 'MX', 'PA',
  // Europe
  'GB', 'FR', 'DE', 'IT', 'ES',
  // Middle East
  'AE', 'SA', 'QA', 'KW',
  // Asia Pacific
  'AU', 'JP', 'SG'
];

/**
 * Ensures countries have the correct sending/receiving flags
 * This is a safety measure to guarantee African countries are never sending countries
 * and explicitly define which countries can send money
 */
const enforceCountryRules = (countries: Country[]): Country[] => {
  console.log('🔍 HOOK ENFORCE: Enforcing country rules...');
  
  return countries.map(country => {
    // If country is in the African countries list - strictly receiving only
    if (RECEIVING_ONLY_COUNTRIES.includes(country.code)) {
      if (country.isSendingEnabled) {
        console.log(`🔍 HOOK ENFORCE: Fixing ${country.name} (${country.code}) - setting isSendingEnabled to false`);
      }
      
      return {
        ...country,
        isSendingEnabled: false,
        isReceivingEnabled: true
      };
    }
    
    // Explicitly define sending countries
    if (SENDING_COUNTRIES.includes(country.code)) {
      if (!country.isSendingEnabled) {
        console.log(`🔍 HOOK ENFORCE: Fixing ${country.name} (${country.code}) - setting isSendingEnabled to true`);
      }
      
      return {
        ...country,
        isSendingEnabled: true
      };
    }
    
    // For all other countries, leave as is
    return country;
  });
};

/**
 * Custom hook for managing countries data
 */
export function useCountries() {
  const [countries, setCountries] = useState<Country[]>(getCachedCountries() || []);
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
          
          // Apply safety rules to cached data
          const processedCachedData = enforceCountryRules(cachedData);
          
          // Debug key countries from cache
          const keyCodes = ['CM', 'GH', 'NG', 'SN', 'US', 'GB', 'AE'];
          console.log('🔍 HOOK CACHE: Key countries from cache after processing:');
          processedCachedData
            .filter(c => keyCodes.includes(c.code))
            .forEach(c => {
              console.log(`🔍 HOOK CACHE: ${c.name} (${c.code}): isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
            });
          
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
            
            // Apply safety rules to API data
            const processedApiData = enforceCountryRules(apiData);
            
            // Debug key countries from API
            const keyCodes = ['CM', 'GH', 'NG', 'SN', 'US', 'GB', 'AE'];
            console.log('🔍 HOOK API: Key countries from API after processing:');
            processedApiData
              .filter(c => keyCodes.includes(c.code))
              .forEach(c => {
                console.log(`🔍 HOOK API: ${c.name} (${c.code}): isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
              });
            
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
        
        // Apply safety rules to mock data
        const processedMockData = enforceCountryRules(mockCountries);
        
        // Debug key countries from mock data
        const keyCodes = ['CM', 'GH', 'NG', 'SN', 'US', 'GB', 'AE'];
        console.log('🔍 HOOK MOCK: Key countries from mock data after processing:');
        processedMockData
          .filter(c => keyCodes.includes(c.code))
          .forEach(c => {
            console.log(`🔍 HOOK MOCK: ${c.name} (${c.code}): isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
          });
        
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
        
        // Apply safety rules to mock data
        const processedMockData = enforceCountryRules(mockCountries);
        
        setCountries(processedMockData);
        setIsLoading(false);
      }
    };

    loadCountries();
  }, [isOffline]);

  // Add extra debugging to investigate what's happening with countries
  useEffect(() => {
    if (countries.length > 0) {
      // After countries are set in state, verify African countries are correctly flagged
      const keyCodes = ['CM', 'GH', 'NG', 'SN'];
      console.log('🔍 HOOK STATE: Countries after being set in state:');
      countries
        .filter(c => keyCodes.includes(c.code))
        .forEach(c => {
          console.log(`🔍 HOOK STATE: ${c.name} (${c.code}): isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
        });
      
      // Count sending vs receiving countries
      const sendingCount = countries.filter(c => c.isSendingEnabled).length;
      const receivingCount = countries.filter(c => c.isReceivingEnabled).length;
      console.log(`🔍 HOOK STATE: Total ${sendingCount} sending and ${receivingCount} receiving countries`);
    }
  }, [countries]);

  const getCountryByCode = useMemo(() => 
    (code: string) => countries.find(country => country.code === code),
    [countries]
  );

  const getSendingCountries = useMemo(() => 
    async () => {
      console.log('🔍 HOOK: Getting sending countries...');
      
      // If we already have countries data, filter it locally and enforce rules
      if (countries.length > 0) {
        // Filter AFTER enforcing rules to ensure consistency
        const filteredCountries = enforceCountryRules(countries);
        const sendingCountries = filteredCountries.filter(country => country.isSendingEnabled);
        
        console.log('🔍 HOOK SENDING: Filtered sending countries:', sendingCountries.map(c => c.name).join(', '));
        return sendingCountries;
      }
      
      if (!isOffline) {
        console.log('🔍 HOOK: Attempting to fetch sending countries directly...');
        const apiData = await fetchSendingCountriesFromApi();
        if (apiData && apiData.length > 0) {
          // Apply safety rules to API data
          const processedApiData = enforceCountryRules(apiData);
          const sendingCountries = processedApiData.filter(country => country.isSendingEnabled);
          
          console.log('🔍 HOOK API SENDING: Successfully loaded sending countries:', sendingCountries.map(c => c.name).join(', '));
          return sendingCountries;
        } else {
          console.log('🔍 HOOK: API returned no sending countries, falling back to mock data');
        }
      }
      
      // Process mock data with safety rules
      const processedMockData = enforceCountryRules(mockCountries);
      const mockSendingCountries = processedMockData.filter(country => country.isSendingEnabled);
      
      console.log('🔍 HOOK MOCK SENDING: Using mock sending countries:', mockSendingCountries.map(c => c.name).join(', '));
      return mockSendingCountries;
    },
    [countries, isOffline]
  );

  const getReceivingCountries = useMemo(() => 
    async () => {
      console.log('🔍 HOOK: Getting receiving countries...');
      
      // If we already have countries data, filter it locally and enforce rules
      if (countries.length > 0) {
        // Filter AFTER enforcing rules to ensure consistency
        const filteredCountries = enforceCountryRules(countries);
        const receivingCountries = filteredCountries.filter(country => country.isReceivingEnabled);
        
        console.log('🔍 HOOK RECEIVING: Filtered receiving countries:', receivingCountries.map(c => c.name).join(', '));
        return receivingCountries;
      }
      
      if (!isOffline) {
        console.log('🔍 HOOK: Attempting to fetch receiving countries directly...');
        const apiData = await fetchReceivingCountriesFromApi();
        if (apiData && apiData.length > 0) {
          // Apply safety rules to API data (though not strictly necessary for receiving countries)
          const processedApiData = enforceCountryRules(apiData);
          const receivingCountries = processedApiData.filter(country => country.isReceivingEnabled);
          
          console.log('🔍 HOOK API RECEIVING: Successfully loaded receiving countries:', receivingCountries.map(c => c.name).join(', '));
          return receivingCountries;
        } else {
          console.log('🔍 HOOK: API returned no receiving countries, falling back to mock data');
        }
      }
      
      // Process mock data with safety rules
      const processedMockData = enforceCountryRules(mockCountries);
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
