
import { Country } from '../../types/country';

const CACHE_KEY = 'countries_data';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Validate that countries data contains sending-enabled countries
 */
const validateCountriesData = (data: Country[]): boolean => {
  if (!Array.isArray(data) || data.length === 0) {
    console.log('❌ Countries data validation failed: Empty or invalid data');
    return false;
  }
  
  // Check if there are sending-enabled countries
  const sendingCountries = data.filter(country => country.isSendingEnabled);
  
  // Validate that we have at least one sending country
  if (sendingCountries.length === 0) {
    console.log('❌ Countries data validation failed: No sending-enabled countries found');
    return false;
  }
  
  console.log(`✅ Countries data validation passed: Found ${sendingCountries.length} sending countries`);
  return true;
};

/**
 * Get countries data from cache if available and valid
 */
export const getCachedCountries = (): Country[] | null => {
  try {
    // In mobile contexts, we need to check if localStorage is available
    if (typeof localStorage === 'undefined') {
      console.log('📱 localStorage not available');
      return null;
    }

    const cachedData = localStorage.getItem(CACHE_KEY);
    if (!cachedData) {
      console.log('🔍 No countries data in cache');
      return null;
    }
    
    const { data, timestamp } = JSON.parse(cachedData);
    const isExpired = Date.now() - timestamp > CACHE_EXPIRY;
    
    // Return data if not expired and valid
    if (!isExpired && Array.isArray(data) && data.length > 0) {
      // Validate that cached data contains sending countries
      if (!validateCountriesData(data)) {
        console.log('⚠️ Cached countries data invalid - missing sending countries');
        return null;
      }
      
      console.log(`🗄️ Using cached countries data, entries: ${data.length}`);
      console.log(`🔢 Cached sending countries: ${data.filter(c => c.isSendingEnabled).length}`);
      console.log(`🔢 Cached receiving countries: ${data.filter(c => c.isReceivingEnabled).length}`);
      return data;
    }
    
    console.log('⏰ Countries cache expired or invalid');
    return null;
  } catch (e) {
    console.error('❌ Error reading countries from cache:', e);
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
      console.log('📱 localStorage not available for caching countries');
      return;
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn('⚠️ Attempted to cache empty or invalid countries data');
      return;
    }
    
    // Validate data before caching
    if (!validateCountriesData(data)) {
      console.warn('⚠️ Attempted to cache invalid countries data (no sending countries)');
      console.log('⚙️ Enhancing data before caching to include sending countries');
      
      // Enhance the data to include sending countries
      const enhancedData = [...data];
      enhancedData.forEach(country => {
        if (['US', 'CA', 'GB', 'CM'].includes(country.code)) {
          country.isSendingEnabled = true;
          console.log(`🔄 Setting ${country.name} as sending-enabled for cache`);
        }
      });
      data = enhancedData;
    }
    
    console.log(`📊 Caching countries stats - Total: ${data.length}, Sending: ${data.filter(c => c.isSendingEnabled).length}, Receiving: ${data.filter(c => c.isReceivingEnabled).length}`);
    
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log(`✅ Updated countries cache with ${data.length} entries`);
  } catch (e) {
    console.error('❌ Error updating countries cache:', e);
  }
};

/**
 * Clear countries cache
 */
export const clearCountriesCache = (): void => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
      console.log('🧹 Countries cache cleared');
    }
  } catch (e) {
    console.error('❌ Error clearing countries cache:', e);
  }
};

/**
 * Force refresh countries data - now just clears cache without reloading
 */
export const forceRefreshCountriesCache = (): void => {
  clearCountriesCache();
  console.log('🔄 Countries cache cleared, page reload is now manual');
  // Removed automatic page reload to prevent blank page
};
