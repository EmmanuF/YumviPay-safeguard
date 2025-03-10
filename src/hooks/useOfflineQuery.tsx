import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useNetwork } from '@/contexts/NetworkContext';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

type OfflineQueryOptions<TData, TError> = UseQueryOptions<TData, TError> & {
  offlineData?: TData;
  offlineFallback?: () => Promise<TData>;
};

export function useOfflineQuery<TData = unknown, TError = unknown>(
  queryKey: unknown[],
  queryFn: () => Promise<TData>,
  options?: OfflineQueryOptions<TData, TError>
): UseQueryResult<TData, TError> & { isOfflineData: boolean } {
  const { isOnline, isOffline, addPausedRequest, offlineModeActive } = useNetwork();
  const [isOfflineData, setIsOfflineData] = useState<boolean>(false);
  
  // Determine if we should use the offlineFallback function
  const shouldUseOfflineFallback = isOffline && options?.offlineFallback;
  
  // Create a function that will execute the original queryFn
  // but queue it for later if offline
  const wrappedQueryFn = async () => {
    // If we're online, execute the normal query
    if (isOnline && !offlineModeActive) {
      setIsOfflineData(false);
      return queryFn();
    }
    
    // If we're offline but have a fallback function, use that
    if (shouldUseOfflineFallback) {
      setIsOfflineData(true);
      const result = await options.offlineFallback!();
      
      // Queue the original query to run when we're back online
      addPausedRequest(() => queryFn());
      
      return result;
    }
    
    // If we're offline with no fallback, try the original function
    // but handle failures gracefully
    try {
      setIsOfflineData(false);
      return await queryFn();
    } catch (error) {
      setIsOfflineData(true);
      console.warn('Query failed while offline:', error);
      
      // Queue the query to retry when we're back online
      addPausedRequest(() => queryFn());
      
      // If we have offline data, return that
      if (options?.offlineData !== undefined) {
        return options.offlineData;
      }
      
      // Otherwise, throw the error for React Query to handle
      throw error;
    }
  };
  
  // Set up React Query with offline-friendly settings
  const result = useQuery({
    queryKey,
    queryFn: wrappedQueryFn,
    // Enable/disable based on network status and options
    enabled: options?.enabled !== false && (!offlineModeActive || shouldUseOfflineFallback),
    // Use longer stale/cache times when offline
    staleTime: isOffline ? Infinity : options?.staleTime,
    gcTime: isOffline ? Infinity : options?.gcTime,
    // Don't retry too aggressively when offline
    retry: (failureCount, error) => {
      if (isOffline) return false;
      return failureCount < (options?.retry || 3);
    },
    // Use existing options
    ...options,
  });
  
  // Return the query result with an additional flag
  return {
    ...result,
    isOfflineData,
  };
}
