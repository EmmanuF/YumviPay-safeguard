
import { createNetworkError, handleNetworkError, NetworkError, showErrorToast } from '@/utils/errorHandling';
import { Preferences } from '@capacitor/preferences';

interface RequestOptions extends RequestInit {
  timeout?: number;
  cacheable?: boolean;
  cacheKey?: string;
  cacheTTL?: number; // in milliseconds
}

interface CachedResponse {
  data: any;
  timestamp: number;
}

const defaultOptions: Partial<RequestOptions> = {
  timeout: 15000, // 15 seconds default timeout
  headers: {
    'Content-Type': 'application/json',
  }
};

// Function to check if cache is still valid
const isCacheValid = (cache: CachedResponse, ttl: number): boolean => {
  const now = Date.now();
  return now - cache.timestamp < ttl;
};

// Function to store data in cache
const setCachedData = async (key: string, data: any): Promise<void> => {
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
const getCachedData = async (key: string): Promise<CachedResponse | null> => {
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
    
    for (const key of cacheKeys) {
      await Preferences.remove({ key });
    }
  } catch (error) {
    console.error('Failed to clear API cache:', error);
  }
};

// Create a request with timeout capability
const timeoutRequest = (promise: Promise<Response>, timeout: number): Promise<Response> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Request timed out'));
    }, timeout);
    
    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  });
};

export async function apiRequest<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const mergedOptions = { ...defaultOptions, ...options };
  const { timeout, cacheable, cacheKey, cacheTTL = 5 * 60 * 1000, ...fetchOptions } = mergedOptions;
  
  const requestKey = cacheKey || `${url}_${JSON.stringify(fetchOptions)}`;
  
  // Try to get from cache if offline or if cacheable is true
  if (!navigator.onLine || cacheable) {
    try {
      const cachedResponse = await getCachedData(requestKey);
      
      if (cachedResponse && (
        !navigator.onLine || 
        (cacheTTL && isCacheValid(cachedResponse, cacheTTL))
      )) {
        console.info('Using cached response for:', url);
        return cachedResponse.data as T;
      }
    } catch (error) {
      console.warn('Error retrieving from cache:', error);
    }
    
    // If offline and no cache available, throw a connection error
    if (!navigator.onLine) {
      throw createNetworkError(
        'You are currently offline and no cached data is available. Please check your internet connection.',
        'connection-error'
      );
    }
  }
  
  try {
    // Make the API request with timeout
    const response = await timeoutRequest(fetch(url, fetchOptions), timeout || 15000);
    
    // Check if response is ok (status 200-299)
    if (!response.ok) {
      throw createNetworkError(
        `API error: ${response.statusText}`,
        response.status >= 500 ? 'server-error' : 
        response.status === 401 || response.status === 403 ? 'authentication-error' : 
        'unknown-error',
        response.status
      );
    }
    
    // Parse the response as JSON
    const data = await response.json();
    
    // Cache the successful response if cacheable
    if (cacheable) {
      await setCachedData(requestKey, data);
    }
    
    return data as T;
  } catch (error) {
    throw handleNetworkError(error);
  }
}

// Helper functions for common HTTP methods
export const get = <T = any>(url: string, options?: RequestOptions) => 
  apiRequest<T>(url, { ...options, method: 'GET' });

export const post = <T = any>(url: string, data: any, options?: RequestOptions) => 
  apiRequest<T>(url, { 
    ...options, 
    method: 'POST', 
    body: JSON.stringify(data) 
  });

export const put = <T = any>(url: string, data: any, options?: RequestOptions) => 
  apiRequest<T>(url, { 
    ...options, 
    method: 'PUT', 
    body: JSON.stringify(data) 
  });

export const del = <T = any>(url: string, options?: RequestOptions) => 
  apiRequest<T>(url, { ...options, method: 'DELETE' });
