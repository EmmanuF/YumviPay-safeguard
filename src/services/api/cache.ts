
import { Preferences } from '@capacitor/preferences';

// Types for the cache functionality
interface CachedResponse {
  data: any;
  timestamp: number;
}

// Function to check if cache is still valid
export const isCacheValid = (cache: CachedResponse, ttl: number): boolean => {
  const now = Date.now();
  return now - cache.timestamp < ttl;
};

// Function to store data in cache
export const setCachedData = async (key: string, data: any): Promise<void> => {
  const cacheData: CachedResponse = {
    data,
    timestamp: Date.now(),
  };
  
  try {
    await Preferences.set({
      key: `api_cache_${key}`,
      value: JSON.stringify(cacheData),
    });
  } catch (error) {
    console.warn('Failed to cache response:', error);
  }
};

// Function to get data from cache
export const getCachedData = async (key: string): Promise<CachedResponse | null> => {
  try {
    const { value } = await Preferences.get({ key: `api_cache_${key}` });
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.warn('Failed to retrieve cached response:', error);
    return null;
  }
};

// Function to clear all cached data
export const clearApiCache = async (): Promise<void> => {
  try {
    const { keys } = await Preferences.keys();
    const cacheKeys = keys.filter(key => key.startsWith('api_cache_'));
    
    const promises = cacheKeys.map(key => Preferences.remove({ key }));
    await Promise.all(promises);
  } catch (error) {
    console.error('Failed to clear API cache:', error);
  }
};
