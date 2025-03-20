
// Store and process paused network requests
export const pausedRequests: Array<() => Promise<any>> = [];

export const processPausedRequests = async (): Promise<{ successCount: number; failureCount: number }> => {
  let successCount = 0;
  let failureCount = 0;
  
  if (pausedRequests.length === 0) {
    return { successCount, failureCount };
  }
  
  // Create a copy of the queue to process
  const requestsToProcess = [...pausedRequests];
  // Clear the queue to avoid processing the same requests multiple times
  pausedRequests.length = 0;
  
  for (const request of requestsToProcess) {
    try {
      await request();
      successCount++;
    } catch (error) {
      console.error('Error processing paused request:', error);
      // Re-add failed requests back to the queue if they should be retried
      pausedRequests.push(request);
      failureCount++;
    }
  }
  
  return { successCount, failureCount };
};

// Load offline mode setting from storage
export const loadOfflineMode = async (): Promise<boolean> => {
  try {
    if (typeof localStorage !== 'undefined') {
      const value = localStorage.getItem('offlineModeActive');
      return value === 'true';
    }
    return false;
  } catch (error) {
    console.warn('Error loading offline mode from storage:', error);
    return false;
  }
};

// Save offline mode setting to storage
export const saveOfflineMode = (isActive: boolean): void => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('offlineModeActive', String(isActive));
    }
  } catch (error) {
    console.warn('Error saving offline mode to storage:', error);
  }
};
