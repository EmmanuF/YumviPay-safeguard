
import { useState, useEffect } from 'react';
import { useNetwork } from '@/contexts/network';
import { isPlatform } from '@/utils/platformUtils';

interface UseOfflineFallbackOptions<T> {
  key: string;
  fetchFn: () => Promise<T>;
  mockData: T;
  cacheDuration?: number; // in milliseconds
  preferOffline?: boolean;
}

/**
 * Hook to fetch data with built-in offline support and caching
 * Falls back to mock data when network requests fail
 */
export function useOfflineFallback<T>({
  key, 
  fetchFn,
  mockData,
  cacheDuration = 30 * 60 * 1000, // 30 minutes default
  preferOffline = false
}: UseOfflineFallbackOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const { isOffline, isOnline, offlineModeActive } = useNetwork();
  
  // Effect to fetch data and handle offline scenarios
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Try to get from cache first
      try {
        const cachedData = await getCachedData(key);
        
        if (cachedData) {
          // If we prefer offline data or are offline, use cached data immediately
          if (preferOffline || isOffline || offlineModeActive) {
            console.log(`Using cached data for ${key}`);
            setData(cachedData.data);
            setLoading(false);
            setIsUsingMockData(false);
            
            // If we're online and not in prefer offline mode, refresh in background
            if (isOnline && !offlineModeActive && !preferOffline) {
              fetchFreshData();
            }
            return;
          }
        }
        
        // If we're offline, use cache or fall back to mock data
        if (isOffline || offlineModeActive) {
          if (cachedData) {
            console.log(`Offline: Using cached data for ${key}`);
            setData(cachedData.data);
            setIsUsingMockData(false);
          } else {
            console.log(`Offline: No cache available, using mock data for ${key}`);
            setData(mockData);
            setIsUsingMockData(true);
            
            // Cache the mock data for future offline use
            await setCachedData(key, mockData);
          }
          setLoading(false);
          return;
        }
        
        // If we're online, try to fetch fresh data
        await fetchFreshData();
      } catch (error) {
        console.error(`Error in useOfflineFallback for ${key}:`, error);
        handleError(error as Error);
      }
    };
    
    fetchData();
  }, [key, isOffline, offlineModeActive, preferOffline]);
  
  // Function to fetch fresh data from network
  const fetchFreshData = async () => {
    try {
      console.log(`Fetching fresh data for ${key}`);
      const freshData = await fetchFn();
      setData(freshData);
      setIsUsingMockData(false);
      setError(null);
      
      // Cache the fresh data
      await setCachedData(key, freshData);
      
      console.log(`Successfully fetched and cached data for ${key}`);
    } catch (error) {
      console.error(`Failed to fetch fresh data for ${key}:`, error);
      handleError(error as Error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle errors by falling back to cache or mock data
  const handleError = async (error: Error) => {
    setError(error);
    
    try {
      // Try to get from cache first
      const cachedData = await getCachedData(key);
      
      if (cachedData) {
        console.log(`Network error: Using cached data for ${key}`);
        setData(cachedData.data);
        setIsUsingMockData(false);
      } else {
        console.log(`Network error: No cache available, using mock data for ${key}`);
        setData(mockData);
        setIsUsingMockData(true);
        
        // Cache the mock data for future use
        await setCachedData(key, mockData);
      }
    } catch (cacheError) {
      console.error(`Error accessing cache for ${key}:`, cacheError);
      setData(mockData);
      setIsUsingMockData(true);
    }
  };
  
  // Force refresh the data
  const refresh = async () => {
    if (!isOffline && !offlineModeActive) {
      setLoading(true);
      await fetchFreshData();
    } else {
      console.log(`Cannot refresh ${key} while offline`);
    }
  };
  
  // Clear cached data
  const clearCache = async () => {
    try {
      if (isPlatform('capacitor')) {
        const { Preferences } = await import('@capacitor/preferences');
        await Preferences.remove({ key: `offline_${key}` });
      } else {
        localStorage.removeItem(`offline_${key}`);
      }
      console.log(`Cleared cache for ${key}`);
    } catch (error) {
      console.error(`Error clearing cache for ${key}:`, error);
    }
  };
  
  return { 
    data: data ?? mockData, 
    loading, 
    error, 
    isUsingMockData, 
    refresh, 
    clearCache 
  };
}

// Helper function to get data from cache
async function getCachedData(key: string): Promise<{ data: any; timestamp: number } | null> {
  try {
    // Use Capacitor Preferences on native platforms
    if (isPlatform('capacitor')) {
      const { Preferences } = await import('@capacitor/preferences');
      const { value } = await Preferences.get({ key: `offline_${key}` });
      
      if (value) {
        const parsedValue = JSON.parse(value);
        return parsedValue;
      }
    } 
    // Fallback to localStorage on web
    else {
      const value = localStorage.getItem(`offline_${key}`);
      
      if (value) {
        const parsedValue = JSON.parse(value);
        return parsedValue;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting cached data for ${key}:`, error);
    return null;
  }
}

// Helper function to cache data
async function setCachedData(key: string, data: any): Promise<void> {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now()
    };
    
    // Use Capacitor Preferences on native platforms
    if (isPlatform('capacitor')) {
      const { Preferences } = await import('@capacitor/preferences');
      await Preferences.set({
        key: `offline_${key}`,
        value: JSON.stringify(cacheItem)
      });
    } 
    // Fallback to localStorage on web
    else {
      localStorage.setItem(`offline_${key}`, JSON.stringify(cacheItem));
    }
  } catch (error) {
    console.error(`Error caching data for ${key}:`, error);
  }
}
