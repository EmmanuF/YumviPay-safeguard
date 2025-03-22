
import { Country } from '../../types/country';

const CACHE_KEY = 'countries_data';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get countries data from cache if available and valid
 */
export const getCachedCountries = (): Country[] | null => {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (!cachedData) return null;
    
    const { data, timestamp } = JSON.parse(cachedData);
    const isExpired = Date.now() - timestamp > CACHE_EXPIRY;
    
    // Return data if not expired
    if (!isExpired && Array.isArray(data) && data.length > 0) {
      console.log('Using cached countries data');
      return data;
    }
    
    return null;
  } catch (e) {
    console.error('Error reading countries from cache:', e);
    return null;
  }
};

/**
 * Update countries cache
 */
export const updateCountriesCache = (data: Country[]): void => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (e) {
    console.error('Error updating countries cache:', e);
  }
};

/**
 * Clear countries cache
 */
export const clearCountriesCache = (): void => {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (e) {
    console.error('Error clearing countries cache:', e);
  }
};

/**
 * Force refresh countries data
 */
export const forceRefreshCountriesCache = (): void => {
  clearCountriesCache();
  window.location.reload();
};
