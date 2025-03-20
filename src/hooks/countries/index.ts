
import { useState, useEffect, useMemo } from 'react';
import { Country, PaymentMethod } from '../../types/country';
import { countries as mockCountries } from '../../data/countries';
import { useNetwork } from '@/contexts/network';
import { getCachedCountries, updateCountriesCache, clearCountriesCache } from './countriesCache';
import { fetchCountriesFromApi, fetchSendingCountriesFromApi, fetchReceivingCountriesFromApi } from './countriesApi';

// Define constant arrays of country codes to ensure proper flags
const AFRICAN_COUNTRY_CODES = ['CM', 'GH', 'NG', 'SN', 'CI', 'BJ', 'TG', 'BF', 'ML', 'NE', 'GW', 'GN', 'SL', 'LR', 'CD', 'GA', 'TD', 'CF', 'CG', 'GQ'];
const RECEIVING_ONLY_COUNTRIES = [...AFRICAN_COUNTRY_CODES]; // All African countries are receiving only

// Define sending countries explicitly - ensure they're always sending countries
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
    
    // Explicitly define sending countries - FORCE them to be sending countries
    if (SENDING_COUNTRIES.includes(country.code)) {
      if (!country.isSendingEnabled) {
        console.log(`🔍 HOOK ENFORCE: Fixing ${country.name} (${country.code}) - setting isSendingEnabled to true`);
      }
      
      return {
        ...country,
        isSendingEnabled: true,
        // Don't override receiving status for sending countries
      };
    }
    
    // For all other countries, leave as is
    return country;
  });
};

// Prepare sending countries in advance to avoid filtering issues
const prepareSendingCountries = (allCountries: Country[]): Country[] => {
  console.log('🔍 HOOK: Preparing sending countries list directly from SENDING_COUNTRIES array');
  
  // Filter to only include countries in our SENDING_COUNTRIES list
  const sendingCountries = allCountries.filter(country => 
    SENDING_COUNTRIES.includes(country.code)
  );
  
  // Force isSendingEnabled=true for all these countries
  const preparedSendingCountries = sendingCountries.map(country => ({
    ...country,
    isSendingEnabled: true
  }));
  
  console.log('🔍 HOOK: Prepared sending countries:', 
    preparedSendingCountries.map(c => `${c.name} (${c.code})`).join(', '));
  
  return preparedSendingCountries;
};

/**
 * Custom hook for managing countries data
 */
export function useCountries() {
  const [countries, setCountries] = useState<Country[]>(enforceCountryRules(getCachedCountries() || []));
  const [isLoading, setIsLoading] = useState(!getCachedCountries());
  const [error, setError] = useState<Error | null>(null);
  const { isOffline } = useNetwork();
  
  // NEW: Add explicit sending/receiving country lists as state variables
  // This ensures they're available immediately without async calls
  const [sendingCountriesList, setSendingCountriesList] = useState<Country[]>(() => {
    const cachedCountries = getCachedCountries();
    if (cachedCountries && cachedCountries.length > 0) {
      return prepareSendingCountries(cachedCountries);
    }
    return prepareSendingCountries(mockCountries);
  });
  
  const [receivingCountriesList, setReceivingCountriesList] = useState<Country[]>(() => {
    const cachedCountries = getCachedCountries();
    if (cachedCountries && cachedCountries.length > 0) {
      return enforceCountryRules(cachedCountries).filter(c => c.isReceivingEnabled);
    }
    return enforceCountryRules(mockCountries).filter(c => c.isReceivingEnabled);
  });

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
          
          // Update sending countries list
          const sendingCountries = prepareSendingCountries(processedCachedData);
          setSendingCountriesList(sendingCountries);
          
          // Update receiving countries list
          const receivingCountries = processedCachedData.filter(c => c.isReceivingEnabled);
          setReceivingCountriesList(receivingCountries);
          
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
            
            // Update sending countries list
            const sendingCountries = prepareSendingCountries(processedApiData);
            setSendingCountriesList(sendingCountries);
            
            // Update receiving countries list 
            const receivingCountries = processedApiData.filter(c => c.isReceivingEnabled);
            setReceivingCountriesList(receivingCountries);
            
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
        
        // Update sending countries list
        const sendingCountries = prepareSendingCountries(processedMockData);
        setSendingCountriesList(sendingCountries);
        
        // Update receiving countries list
        const receivingCountries = processedMockData.filter(c => c.isReceivingEnabled);
        setReceivingCountriesList(receivingCountries);
        
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
        
        // Update sending countries list
        const sendingCountries = prepareSendingCountries(processedMockData);
        setSendingCountriesList(sendingCountries);
        
        // Update receiving countries list
        const receivingCountries = processedMockData.filter(c => c.isReceivingEnabled);
        setReceivingCountriesList(receivingCountries);
        
        setIsLoading(false);
      }
    };

    loadCountries();
  }, [isOffline]);

  // Add extra debugging to investigate what's happening with countries
  useEffect(() => {
    if (countries.length > 0) {
      // After countries are set in state, verify African countries are correctly flagged
      const keyCodes = ['CM', 'GH', 'NG', 'SN', 'US', 'GB', 'AE'];
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
      
      // Debug sending countries list
      console.log('🔍 HOOK STATE: Current sendingCountriesList:', 
        sendingCountriesList.map(c => c.name).join(', '));
    }
  }, [countries, sendingCountriesList]);

  const getCountryByCode = useMemo(() => 
    (code: string) => countries.find(country => country.code === code),
    [countries]
  );

  // NEW: Simplified implementation - return prepared data synchronously when possible
  const getSendingCountries = async () => {
    console.log('🔍 HOOK: getSendingCountries called - returning prepared list directly');
    console.log('🔍 HOOK: Sending countries list contains', sendingCountriesList.length, 'countries');
    console.log('🔍 HOOK: Sending countries:', sendingCountriesList.map(c => c.name).join(', '));
    
    if (sendingCountriesList.length > 0) {
      return sendingCountriesList;
    }
    
    // Fallback to direct filtering if the list is empty
    console.log('🔍 HOOK: Fallback - filtering from countries list');
    return countries.filter(country => SENDING_COUNTRIES.includes(country.code))
      .map(country => ({
        ...country,
        isSendingEnabled: true
      }));
  };

  // NEW: Simplified implementation for receiving countries
  const getReceivingCountries = async () => {
    console.log('🔍 HOOK: getReceivingCountries called - returning prepared list directly');
    console.log('🔍 HOOK: Receiving countries list contains', receivingCountriesList.length, 'countries');
    
    if (receivingCountriesList.length > 0) {
      return receivingCountriesList;
    }
    
    // Fallback to direct filtering
    console.log('🔍 HOOK: Fallback - filtering receiving countries from countries list');
    return enforceCountryRules(countries).filter(country => country.isReceivingEnabled);
  };

  return {
    countries,
    isLoading,
    error,
    getCountryByCode,
    getSendingCountries,
    getReceivingCountries,
    // NEW: Expose the lists directly for components that need immediate access
    sendingCountriesList,
    receivingCountriesList
  };
}

// Re-export the types for easier imports
export type { Country, PaymentMethod } from '../../types/country';
