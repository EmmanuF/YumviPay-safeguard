
import { useState, useEffect, useMemo } from 'react';
import { Country, PaymentMethod } from '../../types/country';
import { countries as mockCountries } from '../../data/countries';
import { useNetwork } from '@/contexts/network';
import { getCachedCountries, updateCountriesCache, clearCountriesCache } from './countriesCache';
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
          
          // Verify the correct flags are set
          const sendingCountries = cachedData.filter(c => c.isSendingEnabled);
          const receivingCountries = cachedData.filter(c => c.isReceivingEnabled);
          
          console.log('Sending countries from cache:', sendingCountries.map(c => c.code).join(', '));
          console.log('Receiving countries from cache:', receivingCountries.map(c => c.code).join(', '));
          
          // Check if we have at least one sending and one receiving country
          if (sendingCountries.length === 0 || receivingCountries.length === 0) {
            console.log('Missing sending or receiving countries in cache, clearing cache');
            clearCountriesCache();
          } else {
            setCountries(cachedData);
            setIsLoading(false);
            return;
          }
        }
        
        setIsLoading(true);
        
        if (!isOffline) {
          // Try to fetch from Supabase if online
          console.log('Attempting to fetch countries from API...');
          const apiData = await fetchCountriesFromApi();
          
          if (apiData && apiData.length > 0) {
            console.log('Successfully loaded', apiData.length, 'countries from API');
            
            // Log sending and receiving countries
            const sendingFromApi = apiData.filter(c => c.isSendingEnabled);
            const receivingFromApi = apiData.filter(c => c.isReceivingEnabled);
            
            console.log('Sending countries from API:', sendingFromApi.map(c => c.code).join(', '));
            console.log('Receiving countries from API:', receivingFromApi.map(c => c.code).join(', '));
            
            // Verify we have both sending and receiving countries from API
            if (sendingFromApi.length > 0 && receivingFromApi.length > 0) {
              updateCountriesCache(apiData);
              setCountries(apiData);
              setIsLoading(false);
              return;
            } else {
              console.log('API returned countries but missing sending or receiving flags, falling back to mock data');
            }
          } else {
            console.log('API returned no countries or failed, falling back to mock data');
          }
        }
        
        // Use mock data if offline or API error
        console.log('Using mock country data due to offline status or API error');
        
        // Verify that mock data has correct sending/receiving flags
        const sendingCountriesFromMock = mockCountries.filter(c => c.isSendingEnabled);
        const receivingCountriesFromMock = mockCountries.filter(c => c.isReceivingEnabled);
        
        console.log('Mock data has', mockCountries.length, 'countries');
        console.log('Sending countries from mock:', sendingCountriesFromMock.map(c => c.code).join(', '));
        console.log('Receiving countries from mock:', receivingCountriesFromMock.map(c => c.code).join(', '));
        
        // Verify we have both sending and receiving countries in mock data
        if (sendingCountriesFromMock.length === 0 || receivingCountriesFromMock.length === 0) {
          console.error('Mock data is missing sending or receiving countries!');
          setError(new Error('No sending or receiving countries available'));
        }
        
        setCountries(mockCountries);
        
        // Update cache with mock data for future use
        updateCountriesCache(mockCountries);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading countries:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch countries'));
        
        // Even if there's an error, fall back to mock data
        console.log('Error occurred, using mock data as fallback');
        
        // Log sending countries from mock data for debugging
        const sendingCountriesFromMock = mockCountries.filter(c => c.isSendingEnabled);
        console.log('Sending countries from mock fallback:', sendingCountriesFromMock.map(c => c.code).join(', '));
        
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
        const sendingCountries = countries.filter(country => country.isSendingEnabled === true);
        console.log('Filtered sending countries from loaded data:', sendingCountries.length);
        console.log('Sending country codes:', sendingCountries.map(c => c.code).join(', '));
        
        if (sendingCountries.length > 0) {
          return sendingCountries;
        } else {
          console.log('No sending countries found in loaded data, trying API or mock data');
        }
      }
      
      if (!isOffline) {
        console.log('Attempting to fetch sending countries directly...');
        const apiData = await fetchSendingCountriesFromApi();
        if (apiData && apiData.length > 0) {
          console.log('Successfully loaded', apiData.length, 'sending countries from API');
          console.log('Sending country codes from API:', apiData.map(c => c.code).join(', '));
          return apiData;
        } else {
          console.log('API returned no sending countries, falling back to mock data');
        }
      }
      
      const mockSendingCountries = mockCountries.filter(country => country.isSendingEnabled === true);
      console.log('Using mock sending countries:', mockSendingCountries.length);
      console.log('Mock sending country codes:', mockSendingCountries.map(c => c.code).join(', '));
      return mockSendingCountries;
    },
    [countries, isOffline]
  );

  const getReceivingCountries = useMemo(() => 
    async () => {
      console.log('Getting receiving countries...');
      
      // If we already have countries data, filter it locally
      if (countries.length > 0) {
        const receivingCountries = countries.filter(country => country.isReceivingEnabled === true);
        console.log('Filtered receiving countries from loaded data:', receivingCountries.length);
        console.log('Receiving country codes:', receivingCountries.map(c => c.code).join(', '));
        
        if (receivingCountries.length > 0) {
          return receivingCountries;
        } else {
          console.log('No receiving countries found in loaded data, trying API or mock data');
        }
      }
      
      if (!isOffline) {
        console.log('Attempting to fetch receiving countries directly...');
        const apiData = await fetchReceivingCountriesFromApi();
        if (apiData && apiData.length > 0) {
          console.log('Successfully loaded', apiData.length, 'receiving countries from API');
          console.log('Receiving country codes from API:', apiData.map(c => c.code).join(', '));
          return apiData;
        } else {
          console.log('API returned no receiving countries, falling back to mock data');
        }
      }
      
      const mockReceivingCountries = mockCountries.filter(country => country.isReceivingEnabled === true);
      console.log('Using mock receiving countries:', mockReceivingCountries.length);
      console.log('Mock receiving country codes:', mockReceivingCountries.map(c => c.code).join(', '));
      return mockReceivingCountries;
    },
    [countries, isOffline]
  );
  
  // Function to manually refresh countries data
  const refreshCountries = async () => {
    console.log('Manually refreshing countries data...');
    clearCountriesCache();
    setIsLoading(true);
    
    try {
      if (!isOffline) {
        const apiData = await fetchCountriesFromApi();
        
        if (apiData && apiData.length > 0) {
          // Verify we have both sending and receiving countries
          const sendingCountries = apiData.filter(c => c.isSendingEnabled);
          const receivingCountries = apiData.filter(c => c.isReceivingEnabled);
          
          console.log('API refresh returned:', {
            total: apiData.length,
            sending: sendingCountries.length,
            receiving: receivingCountries.length
          });
          
          if (sendingCountries.length > 0 && receivingCountries.length > 0) {
            updateCountriesCache(apiData);
            setCountries(apiData);
            console.log('Countries data refreshed successfully from API');
          } else {
            console.log('API missing sending or receiving countries, falling back to mock data');
            setCountries(mockCountries);
            updateCountriesCache(mockCountries);
          }
        } else {
          setCountries(mockCountries);
          updateCountriesCache(mockCountries);
          console.log('Could not get fresh data from API, using mock data');
        }
      } else {
        setCountries(mockCountries);
        updateCountriesCache(mockCountries);
        console.log('Offline mode: refreshed with mock data');
      }
    } catch (err) {
      console.error('Error refreshing countries:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh countries'));
      setCountries(mockCountries);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    countries,
    isLoading,
    error,
    getCountryByCode,
    getSendingCountries,
    getReceivingCountries,
    refreshCountries,
  };
}

// Re-export the types for easier imports
export type { Country, PaymentMethod } from '../../types/country';
