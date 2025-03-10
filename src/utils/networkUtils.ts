
/**
 * Utility functions for network status that can be used outside of React components
 * This avoids using the useNetwork hook in non-component contexts
 */

// Check if the device is currently offline
export const isOffline = (): boolean => {
  return typeof navigator !== 'undefined' ? !navigator.onLine : false;
};

// Add a request to be executed when the device goes online
export const addPausedRequest = (callback: () => Promise<any>): void => {
  if (isOffline()) {
    // Store the request in localStorage to be executed when online
    const requests = JSON.parse(localStorage.getItem('pausedRequests') || '[]');
    requests.push({
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('pausedRequests', JSON.stringify(requests));
    
    // Add event listener to execute when online (if in browser)
    if (typeof window !== 'undefined') {
      const executeRequest = () => {
        callback()
          .then(() => {
            console.log('Paused request executed successfully');
            window.removeEventListener('online', executeRequest);
          })
          .catch(error => {
            console.error('Error executing paused request:', error);
          });
      };
      
      window.addEventListener('online', executeRequest);
    }
  } else {
    // Execute immediately if online
    callback()
      .catch(error => {
        console.error('Error executing request:', error);
      });
  }
};
