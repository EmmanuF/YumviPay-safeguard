
import { toast } from 'sonner';
import { clearApiCache } from '@/services/api/cache';

// Queue for storing requests to be executed when back online
export const pausedRequests: (() => Promise<any>)[] = [];

// Load offline mode from storage
export const loadOfflineMode = async (): Promise<boolean> => {
  try {
    const { Preferences } = await import('@capacitor/preferences');
    const { value } = await Preferences.get({ key: 'offlineModeActive' });
    return value === 'true';
  } catch (error) {
    console.error('Failed to load offline mode status:', error);
    return false;
  }
};

// Save offline mode to storage
export const saveOfflineMode = async (offlineModeActive: boolean): Promise<void> => {
  try {
    const { Preferences } = await import('@capacitor/preferences');
    await Preferences.set({
      key: 'offlineModeActive',
      value: offlineModeActive.toString(),
    });
  } catch (error) {
    console.error('Failed to save offline mode status:', error);
  }
};

// Process all paused requests and return success/failure counts
export const processPausedRequests = async (): Promise<{ successCount: number; failureCount: number }> => {
  console.log(`Processing ${pausedRequests.length} queued requests`);
  toast.info(`Syncing ${pausedRequests.length} pending operations`);
  
  // Create a copy of the requests to process
  const requestsToProcess = [...pausedRequests];
  let successCount = 0;
  let failureCount = 0;
  
  // Process all paused requests
  for (const request of requestsToProcess) {
    try {
      await request();
      // Remove from queue after successful processing
      const index = pausedRequests.indexOf(request);
      if (index > -1) {
        pausedRequests.splice(index, 1);
      }
      successCount++;
    } catch (error) {
      console.error('Error processing queued request:', error);
      failureCount++;
    }
  }
  
  // Clear API cache to ensure fresh data on next fetch
  await clearApiCache();
  
  return { successCount, failureCount };
};
