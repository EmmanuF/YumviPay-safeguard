
import { useState, useEffect, useMemo } from 'react';
import { Country, PaymentMethod } from '../../types/country';
import { countries as mockCountries } from '../../data/countries';
import { useNetwork } from '@/contexts/NetworkContext';
import { getCachedCountries, updateCountriesCache } from './countriesCache';
import { fetchCountriesFromApi, fetchSendingCountriesFromApi, fetchReceivingCountriesFromApi } from './countriesApi';

/**
 * Custom hook for managing countries data
 */
export function useCountries() {
  const [countries, setCountries] = useState<Country[]>(getCachedCountries() || []);
  const [isLoading, setIsLoading] = useState(countries.length === 0);
  const [error, setError] = useState<Error | null>(null);
  const { isOffline } = useNetwork();

  // Debug log countries
  useEffect(() => {
    console.log(`Countries loaded: ${countries.length}`);
    if (countries.length > 0) {
      console.log('Sample country data:', countries[0]);
    }
  }, [countries]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        // Return cached data if it exists and is still valid
        const cachedData = getCachedCountries();
        if (cachedData && cachedData.length > 0) {
          console.log('Using cached countries data from localStorage', cachedData.length);
          setCountries(cachedData);
          setIsLoading(false);
          return;
        }
        
        console.log('No valid cached countries data, fetching new data...');
        setIsLoading(true);
        
        let finalData: Country[] = [];
        
        if (!isOffline) {
          // Try to fetch from Supabase if online
          console.log('Fetching countries from API...');
          const apiData = await fetchCountriesFromApi();
          
          if (apiData && apiData.length > 0) {
            console.log('Successfully fetched countries from API:', apiData.length);
            // Fix any missing flagUrl values
            finalData = apiData.map(country => ({
              ...country,
              flagUrl: country.flagUrl || `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`
            }));
            
            // Update cache with API data
            updateCountriesCache(finalData);
            setCountries(finalData);
            setIsLoading(false);
            console.log('Countries set from API data');
            return;
          } else {
            console.log('API returned no data, falling back to mock data');
          }
        } else {
          console.log('Offline mode detected, using mock data');
        }
        
        // Use mock data if offline or API error
        console.log('Using mock country data, entries:', mockCountries.length);
        // Ensure all mock countries have proper flag URLs
        finalData = mockCountries.map(country => ({
          ...country,
          flagUrl: country.flagUrl || `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`
        }));
        
        // Update cache with mock data
        updateCountriesCache(finalData);
        setCountries(finalData);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error in loadCountries:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch countries'));
        
        // Still try to use mock data in case of error
        console.log('Error occurred, falling back to mock data');
        const fallbackData = mockCountries.map(country => ({
          ...country,
          flagUrl: country.flagUrl || `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`
        }));
        
        setCountries(fallbackData);
        setIsLoading(false);
      }
    };

    // Force refresh countries data if empty
    if (countries.length === 0) {
      localStorage.removeItem('countries');
      loadCountries();
    } else {
      loadCountries();
    }
  }, [isOffline]);

  const getCountryByCode = useMemo(() => 
    (code: string): Country | undefined => {
      if (!code) {
        console.error('getCountryByCode called with empty code');
        return undefined;
      }
      
      const country = countries.find(country => country.code === code);
      if (!country && code === 'CM') {
        // Special handling for Cameroon which is our default country
        const cameroon = mockCountries.find(c => c.code === 'CM');
        if (cameroon) {
          return {
            ...cameroon,
            flagUrl: cameroon.flagUrl || 'https://flagcdn.com/w80/cm.png'
          };
        }
      }
      return country;
    },
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
