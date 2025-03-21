
import { RequestOptions, defaultOptions } from './types';
import { timeoutRequest } from './utils';
import { getCachedData, setCachedData, isCacheValid } from './cache';
import { createNetworkError, handleNetworkError } from '@/utils/errorHandling';
import { retryWithBackoff, isOffline, addPausedRequest } from '@/utils/networkUtils';
import { isPlatform } from '@/utils/platformUtils';

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
    forceNetwork = false,
    queueOffline = true,
    ...fetchOptions 
  } = mergedOptions;
  
  const requestKey = cacheKey || `${url}_${JSON.stringify(fetchOptions)}`;
  const isDeviceOffline = isOffline();
  
  // Try to get from cache if offline or if cacheable is true
  if ((isDeviceOffline && !forceNetwork) || cacheable) {
    try {
      const cachedResponse = await getCachedData(requestKey);
      
      if (cachedResponse && (
        (isDeviceOffline && !forceNetwork) || 
        (cacheTTL && isCacheValid(cachedResponse, cacheTTL))
      )) {
        console.info('Using cached response for:', url);
        return cachedResponse.data as T;
      }
    } catch (error) {
      console.warn('Error retrieving from cache:', error);
    }
    
    // If offline and no cache available, throw a connection error
    if (isDeviceOffline && !forceNetwork) {
      // If we should queue this request for later, do so
      if (queueOffline) {
        console.log(`Queueing offline request: ${url}`);
        
        // Queue the request to be executed when back online
        addPausedRequest(() => apiRequest(url, {
          ...options,
          queueOffline: false, // Prevent re-queueing
          forceNetwork: true // Force network when retrying
        }));
      }
      
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
      try {
        const data = await response.json();
        return data;
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        throw createNetworkError(
          'Invalid response format from server',
          'server-error'
        );
      }
    };
    
    let data: T;
    
    // Use retry logic if enabled
    if (retry) {
      data = await retryWithBackoff(fetchFn, maxRetries, retryDelay);
    } else {
      data = await fetchFn();
    }
    
    // Cache the successful response if cacheable or on native platform
    // Native apps benefit more from aggressive caching
    if (cacheable || isPlatform('capacitor')) {
      await setCachedData(requestKey, data);
    }
    
    return data;
  } catch (error) {
    // If network error and queueOffline is true, queue the request for later
    if (queueOffline && error.name === 'connection-error') {
      console.log(`Adding failed request to queue: ${url}`);
      
      // Queue the request to be executed when back online
      addPausedRequest(() => apiRequest(url, {
        ...options,
        queueOffline: false, // Prevent re-queueing
        forceNetwork: true // Force network when retrying
      }));
    }
    
    throw handleNetworkError(error);
  }
}
