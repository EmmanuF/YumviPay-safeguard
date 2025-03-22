
// Track the offline status (can be used outside of components)
let _isOffline = false;
let _offlineModeActive = false;
let _addPausedRequest: ((callback: () => Promise<any>) => void) | null = null;
let _maxNetworkRetries = 3;
let _retryDelay = 1000;
let _lastOnlineTime: Date | null = null;

// Initialize from stored values if possible
if (typeof window !== 'undefined') {
  try {
    const storedOfflineMode = localStorage.getItem('offlineModeActive');
    if (storedOfflineMode) {
      _offlineModeActive = storedOfflineMode === 'true';
    }
  } catch (error) {
    console.warn('Error reading offline mode from storage:', error);
  }
}

// Function to check if we're offline
export const isOffline = (): boolean => {
  return _isOffline || _offlineModeActive;
};

// Check if offline mode is manually activated
export const isOfflineModeActive = (): boolean => {
  return _offlineModeActive;
};

// Get offline status details
export const getOfflineStatus = () => {
  return {
    isOffline: _isOffline,
    isOfflineModeActive: _offlineModeActive,
    lastOnlineTime: _lastOnlineTime
  };
};

// Add paused requests that will be executed when back online
export const addPausedRequest = (callback: () => Promise<any>): void => {
  if (_addPausedRequest) {
    _addPausedRequest(callback);
  } else {
    console.warn('addPausedRequest not available yet. Request will not be queued.');
    
    // Fallback: Store in localStorage for later retrieval
    try {
      const pendingRequests = JSON.parse(localStorage.getItem('pendingRequests') || '[]');
      pendingRequests.push({
        timestamp: new Date().toISOString(),
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
      localStorage.setItem('pendingRequests', JSON.stringify(pendingRequests));
    } catch (error) {
      console.error('Failed to save pending request to localStorage:', error);
    }
  }
};

// Update the offline status and reference to addPausedRequest function
export const updateNetworkStatus = (
  offline: boolean, 
  offlineMode: boolean,
  addRequest: ((callback: () => Promise<any>) => void),
  lastOnlineAt?: Date | null
): void => {
  const wasOffline = _isOffline;
  
  _isOffline = offline;
  _offlineModeActive = offlineMode;
  _addPausedRequest = addRequest;
  
  if (lastOnlineAt) {
    _lastOnlineTime = lastOnlineAt;
  } else if (!offline && wasOffline) {
    _lastOnlineTime = new Date();
  }
  
  // Update localStorage
  try {
    localStorage.setItem('offlineModeActive', offlineMode.toString());
    localStorage.setItem('isOffline', offline.toString());
    if (_lastOnlineTime) {
      localStorage.setItem('lastOnlineTime', _lastOnlineTime.toISOString());
    }
  } catch (error) {
    console.warn('Failed to update network status in localStorage:', error);
  }
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

// Helper function to retry network requests with backoff
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

// Enhanced function to wait for network connectivity with timeout
export const waitForNetwork = (timeout = 30000): Promise<boolean> => {
  // If we're already online, resolve immediately
  if (typeof navigator !== 'undefined' && navigator.onLine && !_offlineModeActive) {
    return Promise.resolve(true);
  }
  
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => resolve(false), timeout);
    
    const checkOnline = () => {
      if (typeof navigator !== 'undefined' && navigator.onLine && !_offlineModeActive) {
        cleanup();
        resolve(true);
      }
    };
    
    const cleanup = () => {
      clearTimeout(timeoutId);
      window.removeEventListener('online', checkOnline);
    };
    
    window.addEventListener('online', checkOnline);
    
    // Also check periodically in case the event doesn't fire
    const interval = setInterval(() => {
      checkOnline();
    }, 1000);
    
    // Clean up the interval when done
    setTimeout(() => clearInterval(interval), timeout);
  });
};

// Hook to use in components that need to track network status
export const useNetworkStatus = () => {
  // Import React and useEffect only inside function components
  try {
    const { useEffect } = require('react');
    const { useNetwork } = require('@/contexts/NetworkContext');
    
    const { isOffline, offlineModeActive, addPausedRequest, lastOnlineAt } = useNetwork();
    
    // Update the offline status whenever it changes
    useEffect(() => {
      updateNetworkStatus(isOffline, offlineModeActive, addPausedRequest, lastOnlineAt);
    }, [isOffline, offlineModeActive, addPausedRequest, lastOnlineAt]);
    
    return { isOffline, offlineModeActive, addPausedRequest, retryWithBackoff, waitForNetwork };
  } catch (error) {
    console.error('Error in useNetworkStatus hook:', error);
    return { 
      isOffline: false, 
      offlineModeActive: false, 
      addPausedRequest: () => Promise.resolve(),
      retryWithBackoff,
      waitForNetwork
    };
  }
};
