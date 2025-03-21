
import { toast } from 'sonner';
import { clearCountriesCache } from '@/hooks/countries/countriesCache';

/**
 * Utility function to quickly refresh country data
 * This performs a lightweight refresh by just clearing the cache
 * to improve performance during development
 */
export const forceCountryRefresh = async (showToasts = true): Promise<boolean> => {
  try {
    if (showToasts) {
      toast.info('Refreshing country data cache...', { id: 'refresh-toast' });
    }
    
    console.log('🔄 REFRESH: Starting lightweight country data refresh');
    
    // Simply clear the cache to force a fresh fetch on next load
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
    
    return cacheCleared;
  } catch (error) {
    console.error('🔄 REFRESH: Error during country refresh:', error);
    if (showToasts) {
      toast.error('Failed to refresh country data', { id: 'refresh-toast' });
    }
    return false;
  }
};
