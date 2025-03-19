
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
    
    console.log(`Retrieved ${cachedData.countries.length} countries from cache`);
    console.log('Sending countries in cache:', cachedData.countries.filter(c => c.isSendingEnabled).map(c => c.code).join(', '));
    return cachedData.countries;
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
    
    const cacheData: CachedData = {
      countries,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log(`Updated countries cache with ${countries.length} countries`);
    console.log('Sending countries in updated cache:', countries.filter(c => c.isSendingEnabled).map(c => c.code).join(', '));
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
