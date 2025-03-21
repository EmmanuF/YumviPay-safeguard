
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
      console.log('🔍 CACHE: No countries cache found');
      return null;
    }
    
    const cachedData: CachedData = JSON.parse(cachedDataStr);
    const now = Date.now();
    
    // Check if cache is expired
    if (now - cachedData.timestamp > CACHE_EXPIRY) {
      console.log('🔍 CACHE: Countries cache expired, will fetch fresh data');
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    console.log('🔍 CACHE: Using cached countries data');
    
    // Debug African countries specifically
    const africanCountries = cachedData.countries.filter(c => 
      ['CM', 'GH', 'NG', 'SN', 'CI'].includes(c.code));
    
    console.log('🔍 CACHE: African countries sending status:');
    africanCountries.forEach(c => {
      console.log(`🔍 CACHE: ${c.name} (${c.code}): isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
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
    // Debug before caching
    console.log('🔍 CACHE UPDATE: Before caching countries');
    
    // Debug African countries specifically
    const africanCountries = countries.filter(c => 
      ['CM', 'GH', 'NG', 'SN', 'CI'].includes(c.code));
    
    console.log('🔍 CACHE UPDATE: African countries sending status:');
    africanCountries.forEach(c => {
      console.log(`🔍 CACHE UPDATE: ${c.name} (${c.code}): isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
    });
    
    const cacheData: CachedData = {
      countries,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log(`🔍 CACHE UPDATE: Updated countries cache with ${countries.length} countries`);
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
    console.log('🔍 CACHE: Countries cache cleared');
  } catch (error) {
    console.error('Error clearing countries cache:', error);
  }
};
