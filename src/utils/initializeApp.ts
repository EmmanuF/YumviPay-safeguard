
import { initializeSupabase } from '@/integrations/supabase/initializeSupabase';
import { initializeCountries } from './initializeCountries';
import { repairCountryDatabase } from './repairCountryDatabase';
import { clearCountriesCache } from '@/hooks/countries/countriesCache';
import { toast } from 'sonner';

/**
 * Initialize the application on startup
 * This sets up all required data and configurations
 */
export const initializeApp = async (): Promise<void> => {
  try {
    console.log('Starting app initialization...');
    
    // ALWAYS clear cache on startup to ensure fresh data
    console.log('Clearing countries cache on startup to ensure fresh data');
    if (typeof window !== 'undefined') {
      try {
        clearCountriesCache();
        localStorage.removeItem('yumvi_countries_cache'); // Direct removal as backup
        console.log('Countries cache cleared successfully on startup');
      } catch (e) {
        console.warn('Failed to clear countries cache during initialization:', e);
      }
    }
    
    // Initialize Supabase
    await initializeSupabase();
    console.log('Supabase initialized successfully');
    
    // Initialize countries if empty
    try {
      await initializeCountries();
      console.log('Countries initialization check complete');
    } catch (countryError) {
      console.error('Error initializing countries:', countryError);
      // Continue initialization despite country error
    }
    
    // Repair country database to ensure consistent flags - CRITICAL STEP
    try {
      console.log('Running country database repair to ensure consistent data...');
      const repairSuccess = await repairCountryDatabase();
      
      if (repairSuccess) {
        console.log('Country database repair completed successfully');
      } else {
        console.warn('Country database repair completed but no changes were made');
      }
    } catch (repairError) {
      console.error('Error repairing country database:', repairError);
      toast.error('Failed to repair country database. Some features may not work correctly.');
    }
    
    console.log('App initialization complete');
  } catch (error) {
    console.error('Error during app initialization:', error);
    throw error; // Rethrow to allow the caller to handle
  }
};
