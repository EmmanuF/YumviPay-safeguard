
import { useNetwork } from '@/contexts/NetworkContext';

// Track the offline status (can be used outside of components)
let _isOffline = false;

// Function to check if we're offline
export const isOffline = (): boolean => {
  return _isOffline;
};

// Maintain reference to the addPausedRequest function for use outside of components
let _addPausedRequest: ((callback: () => Promise<any>) => void) | null = null;

// Update the offline status and reference to addPausedRequest function
export const updateNetworkStatus = (offline: boolean, addRequest: (callback: () => Promise<any>) => void): void => {
  _isOffline = offline;
  _addPausedRequest = addRequest;
};

// Function to add paused requests that will be executed when back online
export const addPausedRequest = (callback: () => Promise<any>): void => {
  if (_addPausedRequest) {
    _addPausedRequest(callback);
  } else {
    console.warn('addPausedRequest not available yet. Request will not be queued.');
  }
};

// Hook to set up network status tracking
export const useNetworkUtils = (): void => {
  const { isOffline: networkIsOffline, addPausedRequest: networkAddPausedRequest } = useNetwork();
  
  // Update the offline status whenever it changes
  useEffect(() => {
    updateNetworkStatus(networkIsOffline, networkAddPausedRequest);
  }, [networkIsOffline, networkAddPausedRequest]);
};

// Must be imported from React
import { useEffect } from 'react';
