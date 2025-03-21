
import { Country } from '../../types/country';

const CACHE_KEY = 'yumvi_countries_cache';
// Reduce cache expiry to 2 minutes to prevent stale data during development
const CACHE_EXPIRY = 2 * 60 * 1000; // 2 minutes in milliseconds

interface CachedData {
  countries: Country[];
  timestamp: number;
}

/**
 * Get countries from cache if available and not expired
 */
export const getCachedCountries = (): Country[] | null => {
  try {
    if (typeof localStorage === 'undefined') {
      console.log('🔍 CACHE: localStorage not available, skipping cache');
      return null;
    }
    
    const cachedDataStr = localStorage.getItem(CACHE_KEY);
    if (!cachedDataStr) {
      console.log('🔍 CACHE: No countries cache found');
      return null;
    }
    
    let cachedData: CachedData;
    try {
      cachedData = JSON.parse(cachedDataStr);
    } catch (e) {
      console.error('🔍 CACHE: Invalid cache data format, clearing cache', e);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    // Validate cache structure
    if (!cachedData || !Array.isArray(cachedData.countries)) {
      console.error('🔍 CACHE: Invalid countries data structure, clearing cache');
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    const now = Date.now();
    
    // Check if cache is expired
    if (now - cachedData.timestamp > CACHE_EXPIRY) {
      console.log('🔍 CACHE: Countries cache expired, will fetch fresh data');
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    console.log(`🔍 CACHE: Using cached countries data (${cachedData.countries.length} countries)`);
    
    // Debug sending countries
    const sendingCountries = cachedData.countries.filter(c => c.isSendingEnabled);
    console.log(`🔍 CACHE: Found ${sendingCountries.length} sending countries in cache`);
    if (sendingCountries.length > 0) {
      console.log('🔍 CACHE: First 5 sending countries:', sendingCountries.slice(0, 5).map(c => `${c.name} (${c.code})`).join(', '));
    } else {
      console.warn('🔍 CACHE: No sending countries found in cache - might indicate a problem');
    }
    
    return cachedData.countries;
  } catch (error) {
    console.error('Error reading countries cache:', error);
    // If there's an error, clear the cache and return null
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (e) {
      console.error('Failed to clear cache after error:', e);
    }
    return null;
  }
};

/**
 * Update countries cache with new data
 */
export const updateCountriesCache = (countries: Country[]): void => {
  if (!countries || !Array.isArray(countries)) {
    console.error('🔍 CACHE UPDATE: Invalid countries data, not caching', countries);
    return;
  }
  
  if (countries.length === 0) {
    console.warn('🔍 CACHE UPDATE: Empty countries array, not caching');
    return;
  }
  
  try {
    if (typeof localStorage === 'undefined') {
      console.log('🔍 CACHE UPDATE: localStorage not available, skipping cache update');
      return;
    }
    
    // Debug before caching
    console.log(`🔍 CACHE UPDATE: Caching ${countries.length} countries`);
    
    // Debug sending countries
    const sendingCountries = countries.filter(c => c.isSendingEnabled);
    console.log(`🔍 CACHE UPDATE: Caching ${sendingCountries.length} sending countries`);
    if (sendingCountries.length > 0) {
      console.log('🔍 CACHE UPDATE: First 5 sending countries:', sendingCountries.slice(0, 5).map(c => `${c.name} (${c.code})`).join(', '));
    } else {
      console.warn('🔍 CACHE UPDATE: No sending countries found - check enforcement logic');
    }
    
    const cacheData: CachedData = {
      countries,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log(`🔍 CACHE UPDATE: Successfully cached ${countries.length} countries`);
  } catch (error) {
    console.error('Error updating countries cache:', error);
  }
};

/**
 * Clear countries cache
 */
export const clearCountriesCache = (): void => {
  try {
    if (typeof localStorage === 'undefined') {
      console.log('🔍 CACHE: localStorage not available, cannot clear cache');
      return;
    }
    
    localStorage.removeItem(CACHE_KEY);
    console.log('🔍 CACHE: Countries cache cleared successfully');
  } catch (error) {
    console.error('Error clearing countries cache:', error);
  }
};
