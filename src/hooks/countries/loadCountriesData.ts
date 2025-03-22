
import { Country } from '../../types/country';
import { countries as mockCountries } from '../../data/countries';
import { getCachedCountries, updateCountriesCache } from './countriesCache';
import { fetchCountriesFromApi } from './countriesApi';
import { ensureSendingCountriesEnabled, ensureReceivingCountriesEnabled, processCountryData } from './enhanceCountriesData';

/**
 * Load countries data with cache management and fallbacks
 */
export const loadCountriesData = async (
  isOffline: boolean,
  setCountries: (countries: Country[]) => void,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: Error | null) => void
): Promise<void> => {
  try {
    console.log('🔄 Loading countries data...');
    setIsLoading(true);
    
    // Check if we have cached data and if it's valid
    const cachedData = getCachedCountries();
    if (cachedData && cachedData.length > 0) {
      console.log('🗄️ Using cached countries data from localStorage', cachedData.length);
      
      // Ensure the cached data has sending countries enabled
      const enhancedCachedData = ensureSendingCountriesEnabled(cachedData);
      // Also ensure African receiving countries are enabled
      const finalCachedData = ensureReceivingCountriesEnabled(enhancedCachedData);
      
      // Update cache if modifications were made
      if (JSON.stringify(finalCachedData) !== JSON.stringify(cachedData)) {
        console.log('🔄 Updating cache with enhanced countries data');
        updateCountriesCache(finalCachedData);
      }
      
      setCountries(finalCachedData);
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
        console.log(`📥 API receiving countries: ${apiData.filter(c => c.isReceivingEnabled).length}`);
        
        // Process and enhance the API data
        const processedApiData = processCountryData(apiData);
        // First ensure sending countries
        const withSendingCountries = ensureSendingCountriesEnabled(processedApiData);
        // Then ensure African receiving countries
        finalData = ensureReceivingCountriesEnabled(withSendingCountries);
        
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
    
    // Process and enhance the mock data
    const processedMockData = processCountryData(mockCountries);
    // First ensure sending countries
    const withSendingCountries = ensureSendingCountriesEnabled(processedMockData);
    // Then ensure African receiving countries
    finalData = ensureReceivingCountriesEnabled(withSendingCountries);
    
    // Update cache with enhanced mock data
    updateCountriesCache(finalData);
    setCountries(finalData);
    setIsLoading(false);
  } catch (err) {
    console.error('❌ Error in loadCountries:', err);
    setError(err instanceof Error ? err : new Error('Failed to fetch countries'));
    
    // Still try to use mock data in case of error
    console.log('⚠️ Error occurred, falling back to mock data');
    const fallbackData = processCountryData(mockCountries);
    const withSendingCountries = ensureSendingCountriesEnabled(fallbackData);
    const finalFallbackData = ensureReceivingCountriesEnabled(withSendingCountries);
    setCountries(finalFallbackData);
    setIsLoading(false);
  }
};
