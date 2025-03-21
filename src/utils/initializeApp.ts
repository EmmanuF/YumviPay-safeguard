
import { initializeSupabase } from '@/integrations/supabase/initializeSupabase';
import { initializeCountries } from './initializeCountries';
import { repairCountryDatabase } from './repairCountryDatabase';
import { clearCountriesCache } from '@/hooks/countries/countriesCache';

/**
 * Initialize the application on startup
 * This sets up all required data and configurations
 */
export const initializeApp = async (): Promise<void> => {
  try {
    console.log('Starting app initialization...');
    
    // Clear any existing cache to start fresh
    if (typeof window !== 'undefined') {
      try {
        clearCountriesCache();
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
    
    // Repair country database to ensure consistent flags
    try {
      const repairSuccess = await repairCountryDatabase();
      console.log('Country database repair completed:', repairSuccess ? 'Successfully' : 'No changes made');
    } catch (repairError) {
      console.error('Error repairing country database:', repairError);
      // Continue initialization despite repair error
    }
    
    console.log('App initialization complete');
  } catch (error) {
    console.error('Error during app initialization:', error);
    throw error; // Rethrow to allow the caller to handle
  }
};
