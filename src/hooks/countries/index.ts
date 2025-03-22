import { useState, useEffect, useMemo } from 'react';
import { Country, PaymentMethod } from '../../types/country';
import { countries as mockCountries } from '../../data/countries';
import { useNetwork } from '@/contexts/NetworkContext';
import { getCachedCountries, updateCountriesCache, clearCountriesCache } from './countriesCache';
import { fetchCountriesFromApi, fetchSendingCountriesFromApi, fetchReceivingCountriesFromApi } from './countriesApi';

/**
 * Custom hook for managing countries data
 */
export function useCountries() {
  console.log("🔄 useCountries hook initializing");
  const [countries, setCountries] = useState<Country[]>(getCachedCountries() || []);
  const [isLoading, setIsLoading] = useState(countries.length === 0);
  const [error, setError] = useState<Error | null>(null);
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

  useEffect(() => {
    const loadCountries = async () => {
      try {
        console.log('🔄 Loading countries data...');
        
        // Check if we already have countries loaded
        if (countries.length > 0) {
          console.log('✅ Countries already loaded, count:', countries.length);
          
          // Check if we have sending countries
          const sendingCountries = countries.filter(c => c.isSendingEnabled);
          if (sendingCountries.length === 0) {
            console.log('⚠️ No sending countries found in loaded data, forcing refresh');
            clearCountriesCache();
          } else {
            console.log(`📤 Found ${sendingCountries.length} sending countries in loaded data`);
            setIsLoading(false);
            return;
          }
        }
        
        // Return cached data if it exists and is still valid
        const cachedData = getCachedCountries();
        if (cachedData && cachedData.length > 0) {
          console.log('🗄️ Using cached countries data from localStorage', cachedData.length);
          
          // Check sending countries in cached data
          const sendingCountries = cachedData.filter(c => c.isSendingEnabled);
          console.log(`📤 Sending countries in cache: ${sendingCountries.length}`);
          
          if (sendingCountries.length === 0) {
            console.log('⚠️ No sending countries in cached data, fetching fresh data');
            clearCountriesCache();
          } else {
            setCountries(cachedData);
            setIsLoading(false);
            return;
          }
        }
        
        console.log('🚫 No valid cached countries data, fetching new data...');
        setIsLoading(true);
        
        let finalData: Country[] = [];
        
        if (!isOffline) {
          // Try to fetch from Supabase if online
          console.log('🌐 Fetching countries from API...');
          const apiData = await fetchCountriesFromApi();
          
          if (apiData && apiData.length > 0) {
            console.log('✅ Successfully fetched countries from API:', apiData.length);
            console.log(`📤 API sending countries: ${apiData.filter(c => c.isSendingEnabled).length}`);
            
            // Fix any missing flagUrl values
            finalData = apiData.map(country => ({
              ...country,
              flagUrl: country.flagUrl || `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`
            }));
            
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
        
        // Ensure mock data has sending countries
        console.log('🧪 Using mock country data, entries:', mockCountries.length);
        
        // Make sure North American countries are sending-enabled
        const enhancedMockData = [...mockCountries];
        
        // Explicitly set these countries as sending-enabled
        enhancedMockData.forEach(country => {
          if (['US', 'CA', 'GB', 'CM'].includes(country.code)) {
            country.isSendingEnabled = true;
            console.log(`🔄 Setting ${country.name} as sending-enabled`);
          }
        });
        
        // Verify we have sending countries
        const hasSendingCountries = enhancedMockData.some(c => c.isSendingEnabled);
        console.log(`📤 Mock data has sending countries: ${hasSendingCountries}`);
        
        // If still no sending countries, force add USA
        if (!hasSendingCountries) {
          console.log('⚠️ No sending countries in mock data, adding USA');
          enhancedMockData.unshift({
            name: 'United States',
            code: 'US',
            flagUrl: 'https://flagcdn.com/w80/us.png',
            currency: 'USD',
            isSendingEnabled: true,
            isReceivingEnabled: false,
            paymentMethods: []
          });
        }
        
        // Ensure all mock countries have proper flag URLs
        finalData = enhancedMockData.map(country => ({
          ...country,
          flagUrl: country.flagUrl || `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`
        }));
        
        // Log sending countries from final data
        const sendingCountriesFinal = finalData.filter(c => c.isSendingEnabled);
        console.log(`📤 Final sending countries count: ${sendingCountriesFinal.length}`);
        console.log('📤 Final sending countries:', sendingCountriesFinal.map(c => c.name));
        
        // Update cache with enhanced mock data
        updateCountriesCache(finalData);
        setCountries(finalData);
        
        setIsLoading(false);
      } catch (err) {
        console.error('❌ Error in loadCountries:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch countries'));
        
        // Still try to use mock data in case of error
        console.log('⚠️ Error occurred, falling back to mock data');
        const fallbackData = mockCountries.map(country => {
          // Make sure key countries are sending-enabled even in fallback
          if (['US', 'CA', 'GB', 'CM'].includes(country.code)) {
            return {
              ...country,
              isSendingEnabled: true,
              flagUrl: country.flagUrl || `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`
            };
          }
          return {
            ...country,
            flagUrl: country.flagUrl || `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`
          };
        });
        
        setCountries(fallbackData);
        setIsLoading(false);
      }
    };

    // Load countries data
    loadCountries();
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
  };
}

// Re-export the types for easier imports
export type { Country, PaymentMethod } from '../../types/country';
