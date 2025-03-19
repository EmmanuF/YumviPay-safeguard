
import { Country } from '../../types/country';

const CACHE_KEY = 'yumvi_countries_cache';
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes in milliseconds

interface CachedData {
  countries: Country[];
  timestamp: number;
}

/**
 * Get countries from cache if available and not expired
 */
export const getCachedCountries = (): Country[] | null => {
  try {
    const cachedDataStr = localStorage.getItem(CACHE_KEY);
    if (!cachedDataStr) return null;
    
    const cachedData: CachedData = JSON.parse(cachedDataStr);
    const now = Date.now();
    
    // Check if cache is expired
    if (now - cachedData.timestamp > CACHE_EXPIRY) {
      console.log('Countries cache expired, will fetch fresh data');
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    // Validate that cached countries have all required properties
    if (!cachedData.countries || !Array.isArray(cachedData.countries) || cachedData.countries.length === 0) {
      console.log('Invalid countries cache format, clearing cache');
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    // Validate each country has the correct properties
    const validCountries = cachedData.countries.filter(country => {
      return (
        country.name && 
        country.code && 
        country.currency && 
        typeof country.isSendingEnabled === 'boolean' && 
        typeof country.isReceivingEnabled === 'boolean'
      );
    });
    
    if (validCountries.length !== cachedData.countries.length) {
      console.log('Some countries in cache had invalid data, filtering them out');
    }
    
    console.log(`Retrieved ${validCountries.length} countries from cache`);
    
    // Log sending and receiving countries for debugging
    const sendingCountries = validCountries.filter(c => c.isSendingEnabled);
    const receivingCountries = validCountries.filter(c => c.isReceivingEnabled);
    
    console.log('Sending countries in cache:', sendingCountries.map(c => c.name).join(', '));
    console.log('Receiving countries in cache:', receivingCountries.map(c => c.code).join(', '));
    
    // Make sure we have some sending countries - European/North American countries
    const expectedSendingCountryCodes = ['US', 'GB', 'DE', 'FR', 'ES', 'IT', 'CA'];
    const foundSendingCountries = sendingCountries.filter(c => 
      expectedSendingCountryCodes.includes(c.code)
    );
    
    if (sendingCountries.length === 0 || foundSendingCountries.length === 0) {
      console.warn('No sending countries found in cache or missing expected sending countries, clearing cache');
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    // Ensure no African countries are marked as sending
    const africaCountryCodes = ['CM', 'NG', 'GH', 'KE', 'ZA', 'ET', 'CD', 'TZ', 'CI', 'SN', 'ML'];
    const incorrectSendingCountries = sendingCountries.filter(c => 
      africaCountryCodes.includes(c.code)
    );
    
    if (incorrectSendingCountries.length > 0) {
      console.warn('Found African countries incorrectly marked as sending in cache, clearing cache');
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return validCountries;
  } catch (error) {
    console.error('Error reading countries cache:', error);
    localStorage.removeItem(CACHE_KEY); // Clear potentially corrupted cache
    return null;
  }
};

/**
 * Update countries cache with new data
 */
export const updateCountriesCache = (countries: Country[]): void => {
  try {
    if (!countries || !Array.isArray(countries) || countries.length === 0) {
      console.error('Invalid countries data provided for caching');
      return;
    }
    
    // Validate each country has the correct properties
    const validCountries = countries.filter(country => {
      return (
        country.name && 
        country.code && 
        country.currency && 
        typeof country.isSendingEnabled === 'boolean' && 
        typeof country.isReceivingEnabled === 'boolean'
      );
    });
    
    if (validCountries.length !== countries.length) {
      console.warn(`Filtered out ${countries.length - validCountries.length} invalid countries before caching`);
    }
    
    // Ensure correct sending/receiving flags for specific regions
    // European/North American countries should be sending
    const sendingCountryCodes = ['US', 'GB', 'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'CH', 'CA', 'MX', 'PA'];
    // African countries should be receiving
    const africaCountryCodes = ['CM', 'NG', 'GH', 'KE', 'ZA', 'ET', 'CD', 'TZ', 'CI', 'SN', 'ML'];
    
    validCountries.forEach(country => {
      // Ensure African countries are not marked as sending
      if (africaCountryCodes.includes(country.code) && country.isSendingEnabled) {
        console.warn(`Fixing incorrect sending flag for ${country.name}`);
        country.isSendingEnabled = false;
      }
      
      // Ensure European/North American countries are marked as sending
      if (sendingCountryCodes.includes(country.code) && !country.isSendingEnabled) {
        console.warn(`Fixing missing sending flag for ${country.name}`);
        country.isSendingEnabled = true;
      }
    });
    
    const cacheData: CachedData = {
      countries: validCountries,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log(`Updated countries cache with ${validCountries.length} countries`);
    
    // Log sending and receiving countries for debugging
    const sendingCountries = validCountries.filter(c => c.isSendingEnabled);
    const receivingCountries = validCountries.filter(c => c.isReceivingEnabled);
    
    console.log('Sending countries in updated cache:', sendingCountries.map(c => c.name).join(', '));
    console.log('Receiving countries in updated cache:', receivingCountries.map(c => c.code).join(', '));
    
    // Verify we have some sending countries
    if (sendingCountries.length === 0) {
      console.warn('No sending countries found in updated cache!');
    }
  } catch (error) {
    console.error('Error updating countries cache:', error);
  }
};

/**
 * Clear countries cache
 */
export const clearCountriesCache = (): void => {
  try {
    localStorage.removeItem(CACHE_KEY);
    console.log('Countries cache cleared');
  } catch (error) {
    console.error('Error clearing countries cache:', error);
  }
};
