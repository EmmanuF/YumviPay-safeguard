
// Track the offline status (can be used outside of components)
let _isOffline = false;
let _addPausedRequest: ((callback: () => Promise<any>) => void) | null = null;

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
  
  return { isOffline, addPausedRequest };
};
