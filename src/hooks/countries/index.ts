
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
        console.log('🔍 HOOK: Loading countries data...');
        
        // Return cached data if it exists and is still valid
        const cachedData = getCachedCountries();
        if (cachedData && cachedData.length > 0) {
          console.log('🔍 HOOK: Using cached countries data:', cachedData.length, 'countries');
          
          // Debug key countries from cache
          const keyCodes = ['CM', 'GH', 'NG', 'SN'];
          console.log('🔍 HOOK CACHE: Key countries from cache:');
          cachedData
            .filter(c => keyCodes.includes(c.code))
            .forEach(c => {
              console.log(`🔍 HOOK CACHE: ${c.name} (${c.code}): isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
            });
          
          setCountries(cachedData);
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
            
            // Debug key countries from API
            const keyCodes = ['CM', 'GH', 'NG', 'SN'];
            console.log('🔍 HOOK API: Key countries from API:');
            apiData
              .filter(c => keyCodes.includes(c.code))
              .forEach(c => {
                console.log(`🔍 HOOK API: ${c.name} (${c.code}): isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
              });
            
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
        
        // Debug key countries from mock data
        const keyCodes = ['CM', 'GH', 'NG', 'SN'];
        console.log('🔍 HOOK MOCK: Key countries from mock data:');
        mockCountries
          .filter(c => keyCodes.includes(c.code))
          .forEach(c => {
            console.log(`🔍 HOOK MOCK: ${c.name} (${c.code}): isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
          });
        
        setCountries(mockCountries);
        
        // Update cache with mock data for future use
        console.log('🔍 HOOK: Updating cache with mock data');
        updateCountriesCache(mockCountries);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading countries:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch countries'));
        
        // Even if there's an error, fall back to mock data
        console.log('🔍 HOOK ERROR: Error occurred, using mock data as fallback');
        
        // Debug key countries from mock data in error case
        const keyCodes = ['CM', 'GH', 'NG', 'SN'];
        console.log('🔍 HOOK ERROR: Key countries from mock data (error fallback):');
        mockCountries
          .filter(c => keyCodes.includes(c.code))
          .forEach(c => {
            console.log(`🔍 HOOK ERROR: ${c.name} (${c.code}): isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
          });
        
        setCountries(mockCountries);
        setIsLoading(false);
      }
    };

    loadCountries();
  }, [isOffline]);

  // Add extra debugging to investigate what's happening with countries
  useEffect(() => {
    if (countries.length > 0) {
      // After countries are set in state, check if African countries are correctly flagged
      const keyCodes = ['CM', 'GH', 'NG', 'SN'];
      console.log('🔍 HOOK STATE: Countries after being set in state:');
      countries
        .filter(c => keyCodes.includes(c.code))
        .forEach(c => {
          console.log(`🔍 HOOK STATE: ${c.name} (${c.code}): isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
        });
    }
  }, [countries]);

  const getCountryByCode = useMemo(() => 
    (code: string) => countries.find(country => country.code === code),
    [countries]
  );

  const getSendingCountries = useMemo(() => 
    async () => {
      console.log('🔍 HOOK: Getting sending countries...');
      
      // If we already have countries data, filter it locally
      if (countries.length > 0) {
        const sendingCountries = countries.filter(country => country.isSendingEnabled);
        console.log('🔍 HOOK SENDING: Filtered sending countries:', sendingCountries.map(c => c.name).join(', '));
        return sendingCountries;
      }
      
      if (!isOffline) {
        console.log('🔍 HOOK: Attempting to fetch sending countries directly...');
        const apiData = await fetchSendingCountriesFromApi();
        if (apiData && apiData.length > 0) {
          console.log('🔍 HOOK API SENDING: Successfully loaded sending countries:', apiData.map(c => c.name).join(', '));
          return apiData;
        } else {
          console.log('🔍 HOOK: API returned no sending countries, falling back to mock data');
        }
      }
      
      const mockSendingCountries = mockCountries.filter(country => country.isSendingEnabled);
      console.log('🔍 HOOK MOCK SENDING: Using mock sending countries:', mockSendingCountries.map(c => c.name).join(', '));
      return mockSendingCountries;
    },
    [countries, isOffline]
  );

  const getReceivingCountries = useMemo(() => 
    async () => {
      console.log('🔍 HOOK: Getting receiving countries...');
      
      // If we already have countries data, filter it locally
      if (countries.length > 0) {
        const receivingCountries = countries.filter(country => country.isReceivingEnabled);
        console.log('🔍 HOOK RECEIVING: Filtered receiving countries:', receivingCountries.map(c => c.name).join(', '));
        return receivingCountries;
      }
      
      if (!isOffline) {
        console.log('🔍 HOOK: Attempting to fetch receiving countries directly...');
        const apiData = await fetchReceivingCountriesFromApi();
        if (apiData && apiData.length > 0) {
          console.log('🔍 HOOK API RECEIVING: Successfully loaded receiving countries:', apiData.map(c => c.name).join(', '));
          return apiData;
        } else {
          console.log('🔍 HOOK: API returned no receiving countries, falling back to mock data');
        }
      }
      
      const mockReceivingCountries = mockCountries.filter(country => country.isReceivingEnabled);
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
