
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useNetwork } from '@/contexts/NetworkContext';
import { toast } from 'sonner';
import { useState } from 'react';

type OfflineQueryOptions<TData, TError> = Omit<UseQueryOptions<TData, TError>, 'queryFn'> & {
  offlineData?: TData;
  offlineFallback?: () => Promise<TData>;
  showOfflineToast?: boolean;
  offlineToastMessage?: string;
};

export function useOfflineQuery<TData = unknown, TError = unknown>(
  queryKey: unknown[],
  queryFn: () => Promise<TData>,
  options?: OfflineQueryOptions<TData, TError>
): UseQueryResult<TData, TError> & { isOfflineData: boolean } {
  const { isOnline, isOffline, addPausedRequest, offlineModeActive } = useNetwork();
  const [isOfflineData, setIsOfflineData] = useState<boolean>(false);
  
  // Default toast settings
  const showOfflineToast = options?.showOfflineToast ?? true;
  const offlineToastMessage = options?.offlineToastMessage ?? 'Using offline data';
  
  // Determine if we should use the offlineFallback function
  const shouldUseOfflineFallback = (isOffline || offlineModeActive) && options?.offlineFallback;
  
  // Create a function that will execute the original queryFn
  // but queue it for later if offline
  const wrappedQueryFn = async () => {
    // If we're online and not in offline mode, execute the normal query
    if (isOnline && !offlineModeActive) {
      setIsOfflineData(false);
      return queryFn();
    }
    
    // If we're offline but have a fallback function, use that
    if (shouldUseOfflineFallback) {
      setIsOfflineData(true);
      if (showOfflineToast) {
        toast.info(offlineToastMessage);
      }
      
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
        if (showOfflineToast) {
          toast.info(offlineToastMessage);
        }
        return options.offlineData;
      }
      
      // Otherwise, throw the error for React Query to handle
      throw error;
    }
  };
  
  // Set up React Query with offline-friendly settings
  const queryOptions: UseQueryOptions<TData, TError> = {
    ...options,
    queryKey,
    queryFn: wrappedQueryFn,
    // Enable/disable based on network status
    enabled: options?.enabled !== false && (!offlineModeActive || !!shouldUseOfflineFallback),
    // Use longer stale/cache times when offline
    staleTime: (isOffline || offlineModeActive) ? Infinity : options?.staleTime,
    gcTime: (isOffline || offlineModeActive) ? Infinity : options?.gcTime,
    // Don't retry too aggressively when offline
    retry: (failureCount, error) => {
      if (isOffline || offlineModeActive) return false;
      if (typeof options?.retry === 'function') {
        return options.retry(failureCount, error);
      }
      return failureCount < (typeof options?.retry === 'number' ? options.retry : 3);
    },
  };
  
  // Execute the query with our wrapped function and options
  const result = useQuery(queryOptions);
  
  // Return the query result with an additional flag
  return {
    ...result,
    isOfflineData,
  };
}
