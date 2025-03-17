
import { RequestOptions, defaultOptions } from './types';
import { timeoutRequest } from './utils';
import { getCachedData, setCachedData, isCacheValid } from './cache';
import { createNetworkError, handleNetworkError } from '@/utils/errorHandling';
import { retryWithBackoff } from '@/utils/networkUtils';

// Main API request function
export async function apiRequest<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const mergedOptions = { ...defaultOptions, ...options };
  const { 
    timeout, 
    cacheable, 
    cacheKey, 
    cacheTTL = 5 * 60 * 1000, 
    retry, 
    maxRetries, 
    retryDelay,
    ...fetchOptions 
  } = mergedOptions;
  
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
  
  const fetchWithTimeout = () => timeoutRequest(fetch(url, fetchOptions), timeout || 10000);
  
  try {
    // Make the API request with timeout and retry if needed
    const fetchFn = async () => {
      const response = await fetchWithTimeout();
      
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
      return data;
    };
    
    let data: T;
    
    // Use retry logic if enabled
    if (retry) {
      data = await retryWithBackoff(fetchFn, maxRetries, retryDelay);
    } else {
      data = await fetchFn();
    }
    
    // Cache the successful response if cacheable
    if (cacheable) {
      await setCachedData(requestKey, data);
    }
    
    return data;
  } catch (error) {
    throw handleNetworkError(error);
  }
}
