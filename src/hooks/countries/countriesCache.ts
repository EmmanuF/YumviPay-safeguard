
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
    if (!cachedDataStr) {
      console.log('DEBUG: No countries cache found');
      return null;
    }
    
    const cachedData: CachedData = JSON.parse(cachedDataStr);
    const now = Date.now();
    
    // Check if cache is expired
    if (now - cachedData.timestamp > CACHE_EXPIRY) {
      console.log('DEBUG: Countries cache expired, will fetch fresh data');
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    console.log('DEBUG: Using cached countries data, checking first few countries:');
    cachedData.countries.slice(0, 5).forEach(c => {
      console.log(`${c.name}: isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
    });
    
    return cachedData.countries;
  } catch (error) {
    console.error('Error reading countries cache:', error);
    return null;
  }
};

/**
 * Update countries cache with new data
 */
export const updateCountriesCache = (countries: Country[]): void => {
  try {
    const cacheData: CachedData = {
      countries,
      timestamp: Date.now(),
    };
    
    // Log before caching to check values
    console.log('DEBUG: Before caching, checking sending status for first few countries:');
    countries.slice(0, 5).forEach(c => {
      console.log(`${c.name}: isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
    });
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log(`Updated countries cache with ${countries.length} countries`);
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
