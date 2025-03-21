
import { toast } from 'sonner';
import { clearCountriesCache } from '@/hooks/countries/countriesCache';
import { repairCountryDatabase } from './repairCountryDatabase';

/**
 * Utility function to completely refresh country data
 * This performs a full refresh of country data, including:
 * 1. Clearing the cache
 * 2. Repairing the database
 * 3. Optionally reloading the app
 */
export const forceCountryRefresh = async (showToasts = true): Promise<boolean> => {
  try {
    if (showToasts) {
      toast.info('Refreshing country data...', { id: 'refresh-toast' });
    }
    
    console.log('🔄 REFRESH: Starting complete country data refresh');
    
    // Step 1: Clear the cache
    let cacheCleared = false;
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem('yumvi_countries_cache');
        clearCountriesCache();
        console.log('🔄 REFRESH: Countries cache cleared');
        cacheCleared = true;
      } catch (e) {
        console.error('🔄 REFRESH: Failed to clear cache:', e);
      }
    }
    
    // Step 2: Repair the database (at least attempt to)
    let repairSuccess = false;
    try {
      console.log('🔄 REFRESH: Repairing country database...');
      repairSuccess = await repairCountryDatabase();
      console.log('🔄 REFRESH: Country database repair result:', repairSuccess);
    } catch (e) {
      console.error('🔄 REFRESH: Error repairing country database:', e);
      if (showToasts) {
        toast.error('Failed to repair country database', { id: 'refresh-toast' });
      }
    }
    
    // Even if repair failed, we can still proceed with cache clearing
    if (cacheCleared && showToasts) {
      toast.success('Country cache refreshed', {
        id: 'refresh-toast',
        duration: 5000,
        action: {
          label: 'Reload App',
          onClick: () => window.location.reload()
        }
      });
    }
    
    // If cache was cleared, we consider it partially successful
    return cacheCleared || repairSuccess;
  } catch (error) {
    console.error('🔄 REFRESH: Error during country refresh:', error);
    if (showToasts) {
      toast.error('Failed to refresh country data', { id: 'refresh-toast' });
    }
    return false;
  }
};
