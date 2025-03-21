
import { initializeSupabase } from '@/integrations/supabase/initializeSupabase';
import { initializeCountries } from './initializeCountries';
import { repairCountryDatabase } from './repairCountryDatabase';

/**
 * Initialize the application on startup
 * This sets up all required data and configurations
 */
export const initializeApp = async (): Promise<void> => {
  try {
    console.log('Starting app initialization...');
    
    // Initialize Supabase
    await initializeSupabase();
    
    // Initialize countries if empty
    await initializeCountries();
    
    // Repair country database to ensure consistent flags
    await repairCountryDatabase();
    
    console.log('App initialization complete');
  } catch (error) {
    console.error('Error during app initialization:', error);
  }
};
