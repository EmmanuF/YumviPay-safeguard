
import { Country } from '../../types/country';

const CACHE_KEY = 'countries_data';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get countries data from cache if available and valid
 */
export const getCachedCountries = (): Country[] | null => {
  try {
    // In mobile contexts, we need to check if localStorage is available
    if (typeof localStorage === 'undefined') {
      console.log('localStorage not available');
      return null;
    }

    const cachedData = localStorage.getItem(CACHE_KEY);
    if (!cachedData) {
      console.log('No countries data in cache');
      return null;
    }
    
    const { data, timestamp } = JSON.parse(cachedData);
    const isExpired = Date.now() - timestamp > CACHE_EXPIRY;
    
    // Return data if not expired
    if (!isExpired && Array.isArray(data) && data.length > 0) {
      console.log('Using cached countries data, entries:', data.length);
      return data;
    }
    
    console.log('Countries cache expired or invalid');
    return null;
  } catch (e) {
    console.error('Error reading countries from cache:', e);
    // Clear potentially corrupted cache
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(CACHE_KEY);
      }
    } catch (clearError) {}
    return null;
  }
};

/**
 * Update countries cache
 */
export const updateCountriesCache = (data: Country[]): void => {
  try {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      console.log('localStorage not available for caching countries');
      return;
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn('Attempted to cache empty or invalid countries data');
      return;
    }
    
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log(`Updated countries cache with ${data.length} entries`);
  } catch (e) {
    console.error('Error updating countries cache:', e);
  }
};

/**
 * Clear countries cache
 */
export const clearCountriesCache = (): void => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
      console.log('Countries cache cleared');
    }
  } catch (e) {
    console.error('Error clearing countries cache:', e);
  }
};

/**
 * Force refresh countries data
 */
export const forceRefreshCountriesCache = (): void => {
  clearCountriesCache();
  console.log('Forcing page reload to refresh countries data');
  window.location.reload();
};
