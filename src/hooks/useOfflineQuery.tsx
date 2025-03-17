
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useNetwork } from '@/contexts/NetworkContext';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { isPlatform } from '@/utils/platformUtils';

type OfflineQueryOptions<TData, TError> = Omit<UseQueryOptions<TData, TError>, 'queryFn'> & {
  offlineData?: TData;
  offlineFallback?: () => Promise<TData>;
  showOfflineToast?: boolean;
  offlineToastMessage?: string;
  persistOfflineData?: boolean;
  storageKey?: string;
  preferOfflineData?: boolean;
};

export function useOfflineQuery<TData = unknown, TError = unknown>(
  queryKey: unknown[],
  queryFn: () => Promise<TData>,
  options?: OfflineQueryOptions<TData, TError>
): UseQueryResult<TData, TError> & { 
  isOfflineData: boolean;
  refreshWithForce: () => Promise<TData | undefined>;
} {
  const { isOnline, isOffline, addPausedRequest, offlineModeActive } = useNetwork();
  const [isOfflineData, setIsOfflineData] = useState<boolean>(false);
  const [storedData, setStoredData] = useState<TData | undefined>(undefined);

  // Default options
  const showOfflineToast = options?.showOfflineToast ?? true;
  const offlineToastMessage = options?.offlineToastMessage ?? 'Using offline data';
  const persistOfflineData = options?.persistOfflineData ?? true;
  const storageKey = options?.storageKey ?? `offline_data_${queryKey.join('_')}`;
  const preferOfflineData = options?.preferOfflineData ?? false;
  
  // Load saved data from storage on mount if we're persisting offline data
  useEffect(() => {
    if (persistOfflineData) {
      const loadData = async () => {
        try {
          const { Preferences } = await import('@capacitor/preferences');
          const { value } = await Preferences.get({ key: storageKey });
          
          if (value) {
            const parsedData = JSON.parse(value);
            setStoredData(parsedData);
            
            if (preferOfflineData || isOffline || offlineModeActive) {
              setIsOfflineData(true);
            }
          }
        } catch (error) {
          console.error('Error loading offline data from storage:', error);
        }
      };
      
      loadData();
    }
  }, [persistOfflineData, storageKey]);
  
  // Save data to storage whenever we get new online data
  const saveDataToStorage = async (data: TData) => {
    if (!persistOfflineData) return;
    
    try {
      const { Preferences } = await import('@capacitor/preferences');
      await Preferences.set({
        key: storageKey,
        value: JSON.stringify(data),
      });
      
      console.log(`Data saved to offline storage: ${storageKey}`);
    } catch (error) {
      console.error('Error saving offline data to storage:', error);
    }
  };
  
  // Determine if we should use the offlineFallback function
  const shouldUseOfflineFallback = (isOffline || offlineModeActive) && options?.offlineFallback;
  
  // Create a function that will execute the original queryFn
  // but queue it for later if offline
  const wrappedQueryFn = async () => {
    // If preferOfflineData is true and we have stored data, use that first
    if (preferOfflineData && storedData !== undefined) {
      setIsOfflineData(true);
      
      // Queue the original query to run in the background if online
      if (isOnline && !offlineModeActive) {
        fetchFreshData().catch(error => {
          console.error('Background refresh failed:', error);
        });
      }
      
      return storedData;
    }
    
    // If we're online and not in offline mode, execute the normal query
    if (isOnline && !offlineModeActive) {
      try {
        setIsOfflineData(false);
        const data = await queryFn();
        
        // Save successful result to storage
        await saveDataToStorage(data);
        setStoredData(data);
        
        return data;
      } catch (error) {
        console.error('Online query failed:', error);
        
        // If we have stored data, fall back to that
        if (storedData !== undefined) {
          setIsOfflineData(true);
          if (showOfflineToast) {
            toast.info('Could not reach server, using saved data');
          }
          return storedData;
        }
        
        // Otherwise, continue with error handling
        throw error;
      }
    }
    
    // If we're offline but have a fallback function, use that
    if (shouldUseOfflineFallback) {
      setIsOfflineData(true);
      if (showOfflineToast) {
        toast.info(offlineToastMessage);
      }
      
      try {
        const result = await options.offlineFallback!();
        
        // Save fallback result to storage
        await saveDataToStorage(result);
        setStoredData(result);
        
        // Queue the original query to run when we're back online
        addPausedRequest(() => fetchFreshData());
        
        return result;
      } catch (fallbackError) {
        console.error('Offline fallback failed:', fallbackError);
        
        // If we have stored data, return that as a last resort
        if (storedData !== undefined) {
          return storedData;
        }
        
        throw fallbackError;
      }
    }
    
    // If we're offline with no fallback, try using stored data
    if ((isOffline || offlineModeActive) && storedData !== undefined) {
      setIsOfflineData(true);
      if (showOfflineToast) {
        toast.info(offlineToastMessage);
      }
      
      // Queue the original query to run when we're back online
      addPausedRequest(() => fetchFreshData());
      
      return storedData;
    }
    
    // If we're offline with no fallback and no stored data, try the original function
    // but handle failures gracefully
    try {
      setIsOfflineData(false);
      const data = await queryFn();
      
      // Save successful result to storage
      await saveDataToStorage(data);
      setStoredData(data);
      
      return data;
    } catch (error) {
      setIsOfflineData(true);
      console.warn('Query failed while offline:', error);
      
      // Queue the query to retry when we're back online
      addPausedRequest(() => fetchFreshData());
      
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

  // Function to fetch fresh data and update storage
  const fetchFreshData = async (): Promise<TData> => {
    try {
      const fresh = await queryFn();
      await saveDataToStorage(fresh);
      setStoredData(fresh);
      return fresh;
    } catch (error) {
      console.error('Error fetching fresh data:', error);
      throw error;
    }
  };
  
  // Function to force a refresh regardless of network state
  const refreshWithForce = async (): Promise<TData | undefined> => {
    if (isOnline) {
      try {
        const data = await fetchFreshData();
        setIsOfflineData(false);
        return data;
      } catch (error) {
        console.error('Forced refresh failed:', error);
        toast.error('Could not refresh data from server');
        return undefined;
      }
    } else {
      toast.warning('Cannot refresh while offline');
      return undefined;
    }
  };
  
  // Set up React Query with offline-friendly settings
  const queryOptions: UseQueryOptions<TData, TError> = {
    ...options,
    queryKey,
    queryFn: wrappedQueryFn,
    // Enable/disable based on network status and other conditions
    enabled: options?.enabled !== false && (
      isOnline || 
      !!shouldUseOfflineFallback || 
      storedData !== undefined ||
      options?.offlineData !== undefined
    ),
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
  
  // Return the query result with additional flags and functions
  return {
    ...result,
    isOfflineData,
    refreshWithForce,
  };
}

// Helper hook for simpler cases where we just want to cache data
export function useCachedData<TData = unknown>(
  key: string,
  fetcher: () => Promise<TData>,
  initialData?: TData
) {
  const isNative = isPlatform('capacitor');
  const { isOffline, offlineModeActive } = useNetwork();
  
  return useOfflineQuery<TData>(
    [key], // Pass the key as an array for the queryKey
    fetcher,
    {
      queryKey: [key], // Explicitly specify the queryKey
      offlineData: initialData,
      staleTime: isNative ? 5 * 60 * 1000 : 30 * 1000, // 5 minutes on native, 30 seconds on web
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
      persistOfflineData: isNative, // Only persist on native platforms
      preferOfflineData: isNative && (isOffline || offlineModeActive),
      retry: isOffline || offlineModeActive ? false : 2
    }
  );
}
