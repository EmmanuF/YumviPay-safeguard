
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useNetworkStatus } from './useNetworkStatus';
import { showErrorToast } from '@/utils/errorHandling';

export function useOfflineQuery<TData = unknown, TError = unknown>(
  queryKey: unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, TError> {
  const { isOnline } = useNetworkStatus();
  
  return useQuery({
    queryKey,
    queryFn,
    // Enable/disable based on network status
    enabled: options?.enabled !== false && (isOnline || options?.enabled),
    // Customize stale time and cache time for offline mode
    staleTime: isOnline ? options?.staleTime : Infinity,
    gcTime: isOnline ? options?.gcTime : Infinity,
    // Retry configuration for network issues
    retry: (failureCount, error) => {
      // Don't retry if we're offline
      if (!isOnline) return false;
      
      // Custom retry logic
      const shouldRetry = 
        failureCount < (options?.retry as number || 3) && 
        (error as any)?.type !== 'authentication-error';
      
      return shouldRetry;
    },
    // Handle errors gracefully
    onError: (error) => {
      if (options?.onError) {
        options.onError(error);
      } else {
        showErrorToast(error);
      }
    },
    ...options,
  });
}
