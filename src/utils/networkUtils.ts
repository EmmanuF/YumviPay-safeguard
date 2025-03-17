
// Track the offline status (can be used outside of components)
let _isOffline = false;
let _addPausedRequest: ((callback: () => Promise<any>) => void) | null = null;
let _maxNetworkRetries = 3;
let _retryDelay = 1000;

// Function to check if we're offline
export const isOffline = (): boolean => {
  return _isOffline;
};

// Add paused requests that will be executed when back online
export const addPausedRequest = (callback: () => Promise<any>): void => {
  if (_addPausedRequest) {
    _addPausedRequest(callback);
  } else {
    console.warn('addPausedRequest not available yet. Request will not be queued.');
  }
};

// Update the offline status and reference to addPausedRequest function
export const updateNetworkStatus = (
  offline: boolean, 
  addRequest: ((callback: () => Promise<any>) => void)
): void => {
  _isOffline = offline;
  _addPausedRequest = addRequest;
};

// Set network configuration
export const configureNetwork = (options: {
  maxRetries?: number;
  retryDelay?: number;
}) => {
  if (options.maxRetries !== undefined) {
    _maxNetworkRetries = options.maxRetries;
  }
  if (options.retryDelay !== undefined) {
    _retryDelay = options.retryDelay;
  }
};

// Helper function to retry network requests
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = _maxNetworkRetries,
  delay: number = _retryDelay
): Promise<T> => {
  let retries = 0;
  
  const execute = async (): Promise<T> => {
    try {
      return await fn();
    } catch (err) {
      if (retries >= maxRetries) {
        throw err;
      }
      
      const nextDelay = delay * Math.pow(2, retries);
      console.log(`Retry attempt ${retries + 1} after ${nextDelay}ms`);
      
      retries++;
      return new Promise(resolve => {
        setTimeout(() => resolve(execute()), nextDelay);
      });
    }
  };
  
  return execute();
};

// Hook to use in components that need to track network status
export const useNetworkStatus = () => {
  // Import React and useEffect only inside function components
  const { useEffect } = require('react');
  const { useNetwork } = require('@/contexts/NetworkContext');
  
  const { isOffline, addPausedRequest } = useNetwork();
  
  // Update the offline status whenever it changes
  useEffect(() => {
    updateNetworkStatus(isOffline, addPausedRequest);
  }, [isOffline, addPausedRequest]);
  
  return { isOffline, addPausedRequest, retryWithBackoff };
};
