
import { useState, useEffect, useMemo } from 'react';
import { Country, PaymentMethod } from '../../types/country';
import { countries as mockCountries } from '../../data/countries';
import { useNetwork } from '@/contexts/NetworkContext';
import { getCachedCountries, updateCountriesCache, clearCountriesCache } from './countriesCache';
import { fetchCountriesFromApi, fetchSendingCountriesFromApi, fetchReceivingCountriesFromApi } from './countriesApi';

/**
 * Ensure North American countries are marked as sending-enabled
 */
const ensureSendingCountriesEnabled = (data: Country[]): Country[] => {
  const enhancedData = [...data];
  let changesMade = false;
  
  // Countries that should always be sending-enabled
  const sendingCountryCodes = ['US', 'CA', 'GB', 'CM'];
  
  enhancedData.forEach(country => {
    if (sendingCountryCodes.includes(country.code) && !country.isSendingEnabled) {
      country.isSendingEnabled = true;
      console.log(`🔄 Setting ${country.name} as sending-enabled`);
      changesMade = true;
    }
  });
  
  // If no sending countries exist at all, enable key countries
  const hasSendingCountries = enhancedData.some(c => c.isSendingEnabled);
  if (!hasSendingCountries) {
    enhancedData.forEach(country => {
      if (sendingCountryCodes.includes(country.code)) {
        country.isSendingEnabled = true;
        console.log(`🔄 Setting ${country.name} as sending-enabled (fallback)`);
        changesMade = true;
      }
    });
  }
  
  // Add any missing key countries
  sendingCountryCodes.forEach(code => {
    const exists = enhancedData.some(c => c.code === code);
    if (!exists) {
      // Add country if it's missing
      let mockCountry = mockCountries.find(c => c.code === code);
      if (mockCountry) {
        const newCountry = {
          ...mockCountry,
          isSendingEnabled: true,
          flagUrl: mockCountry.flagUrl || `https://flagcdn.com/w80/${code.toLowerCase()}.png`
        };
        enhancedData.push(newCountry);
        console.log(`➕ Adding missing sending country: ${newCountry.name}`);
        changesMade = true;
      }
    }
  });
  
  // For logging purposes, count sending countries after enhancement
  const sendingCountriesCount = enhancedData.filter(c => c.isSendingEnabled).length;
  console.log(`📤 Enhanced sending countries count: ${sendingCountriesCount}, changes made: ${changesMade}`);
  
  return enhancedData;
};

/**
 * Custom hook for managing countries data
 */
export function useCountries() {
  console.log("🔄 useCountries hook initializing");
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [forceRefresh, setForceRefresh] = useState(0);
  const { isOffline } = useNetwork();

  // Debug log countries
  useEffect(() => {
    console.log(`📊 Countries loaded: ${countries.length}`);
    if (countries.length > 0) {
      console.log('📋 Sample country data:', countries[0]);
      
      // Check sending countries specifically
      const sendingCountries = countries.filter(c => c.isSendingEnabled);
      console.log(`📤 Sending countries: ${sendingCountries.length}`);
      if (sendingCountries.length > 0) {
        console.log('📤 Sample sending country:', sendingCountries[0]);
        console.log('📤 All sending countries:', sendingCountries.map(c => c.name));
      } else {
        console.log('⚠️ No sending countries found!');
      }
      
      // DEBUG: Log Cameroon data specifically to check payment method IDs
      const cameroon = countries.find(c => c.code === 'CM');
      if (cameroon) {
        console.log('🇨🇲 DEBUG - Cameroon country data:', cameroon);
        console.log('🇨🇲 DEBUG - Cameroon payment methods:', cameroon.paymentMethods);
        if (cameroon.paymentMethods && cameroon.paymentMethods.length > 0) {
          cameroon.paymentMethods.forEach(method => {
            console.log(`🇨🇲 DEBUG - Payment method ID format: "${method.id}" (${typeof method.id})`);
          });
        }
      } else {
        console.log('🇨🇲 DEBUG - Cameroon data not found in countries list');
      }
    }
  }, [countries]);

  // Refresh countries data
  const refreshCountriesData = () => {
    console.log("🔄 Manually refreshing countries data");
    clearCountriesCache();
    setForceRefresh(prev => prev + 1);
  };

  useEffect(() => {
    const loadCountries = async () => {
      try {
        console.log('🔄 Loading countries data...');
        setIsLoading(true);
        
        // Check if we have cached data and if it's valid
        const cachedData = getCachedCountries();
        if (cachedData && cachedData.length > 0) {
          console.log('🗄️ Using cached countries data from localStorage', cachedData.length);
          
          // Ensure the cached data has sending countries enabled
          const enhancedCachedData = ensureSendingCountriesEnabled(cachedData);
          
          // Update cache if modifications were made
          if (JSON.stringify(enhancedCachedData) !== JSON.stringify(cachedData)) {
            console.log('🔄 Updating cache with enhanced countries data');
            updateCountriesCache(enhancedCachedData);
          }
          
          setCountries(enhancedCachedData);
          setIsLoading(false);
          return;
        }
        
        console.log('🚫 No valid cached countries data, fetching new data...');
        
        let finalData: Country[] = [];
        
        if (!isOffline) {
          // Try to fetch from Supabase if online
          console.log('🌐 Fetching countries from API...');
          const apiData = await fetchCountriesFromApi();
          
          if (apiData && apiData.length > 0) {
            console.log('✅ Successfully fetched countries from API:', apiData.length);
            console.log(`📤 API sending countries: ${apiData.filter(c => c.isSendingEnabled).length}`);
            
            // Fix any missing flagUrl values
            let processedApiData = apiData.map(country => ({
              ...country,
              flagUrl: country.flagUrl || `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`
            }));
            
            // Ensure API data has sending countries enabled
            finalData = ensureSendingCountriesEnabled(processedApiData);
            
            // Update cache with API data
            updateCountriesCache(finalData);
            setCountries(finalData);
            setIsLoading(false);
            console.log('✅ Countries set from API data');
            return;
          } else {
            console.log('⚠️ API returned no data, falling back to mock data');
          }
        } else {
          console.log('📵 Offline mode detected, using mock data');
        }
        
        // Using mock data as fallback
        console.log('🧪 Using mock country data, entries:', mockCountries.length);
        
        // Process mock data
        let processedMockData = mockCountries.map(country => ({
          ...country,
          flagUrl: country.flagUrl || `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`
        }));
        
        // Ensure mock data has sending countries enabled
        finalData = ensureSendingCountriesEnabled(processedMockData);
        
        // Update cache with enhanced mock data
        updateCountriesCache(finalData);
        setCountries(finalData);
        setIsLoading(false);
      } catch (err) {
        console.error('❌ Error in loadCountries:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch countries'));
        
        // Still try to use mock data in case of error
        console.log('⚠️ Error occurred, falling back to mock data');
        const fallbackData = mockCountries.map(country => ({
          ...country,
          flagUrl: country.flagUrl || `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`
        }));
        
        // Ensure fallback data has sending countries enabled
        const enhancedFallbackData = ensureSendingCountriesEnabled(fallbackData);
        setCountries(enhancedFallbackData);
        setIsLoading(false);
      }
    };

    // Load countries data
    loadCountries();
  }, [isOffline, forceRefresh]);

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
        const sendingCountries = countries.filter(country => country.isSendingEnabled);
        console.log(`Retrieved ${sendingCountries.length} sending countries from local data`);
        return sendingCountries;
      }
      
      if (!isOffline) {
        const apiData = await fetchSendingCountriesFromApi();
        if (apiData) {
          console.log(`Retrieved ${apiData.length} sending countries from API`);
          return apiData;
        }
      }
      
      const mockSendingCountries = mockCountries.filter(country => country.isSendingEnabled);
      console.log(`Retrieved ${mockSendingCountries.length} sending countries from mock data`);
      
      // If no sending countries in mock data, make the US a sending country
      if (mockSendingCountries.length === 0) {
        const usa = {
          name: 'United States',
          code: 'US',
          flagUrl: 'https://flagcdn.com/w80/us.png',
          currency: 'USD',
          isSendingEnabled: true,
          isReceivingEnabled: false,
          paymentMethods: []
        };
        console.log('No sending countries in mock data, adding USA');
        return [usa];
      }
      
      return mockSendingCountries;
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
    refreshCountriesData, // Expose this so we can refresh countries from other components
  };
}

// Re-export the types for easier imports
export type { Country, PaymentMethod } from '../../types/country';
