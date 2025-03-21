
// Track the offline status (can be used outside of components)
let _isOffline = false;
let _offlineModeActive = false;

// Store paused requests that will be executed when back online
export const pausedRequests: Array<() => Promise<any>> = [];

// Function to load offline mode setting from storage
export const loadOfflineMode = async (): Promise<boolean> => {
  try {
    if (typeof localStorage !== 'undefined') {
      const storedMode = localStorage.getItem('offlineModeActive');
      return storedMode === 'true';
    }
    return false;
  } catch (error) {
    console.warn('Error loading offline mode from storage:', error);
    return false;
  }
};

// Function to save offline mode setting to storage
export const saveOfflineMode = async (mode: boolean): Promise<void> => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('offlineModeActive', mode.toString());
    }
  } catch (error) {
    console.warn('Error saving offline mode to storage:', error);
  }
};

// Process paused requests when back online
export const processPausedRequests = async (): Promise<{ successCount: number; failureCount: number }> => {
  let successCount = 0;
  let failureCount = 0;
  
  if (pausedRequests.length === 0) {
    return { successCount, failureCount };
  }
  
  console.log(`Processing ${pausedRequests.length} queued requests`);
  
  // Create a copy of the paused requests array
  const requestsToProcess = [...pausedRequests];
  
  // Clear the original array before processing
  pausedRequests.length = 0;
  
  // Process each request
  for (const request of requestsToProcess) {
    try {
      await request();
      successCount++;
    } catch (error) {
      console.error('Error processing queued request:', error);
      failureCount++;
      
      // Re-add the failed request to the queue
      pausedRequests.push(request);
    }
  }
  
  console.log(`Processed ${successCount} requests successfully, ${failureCount} failed`);
  
  return { successCount, failureCount };
};
