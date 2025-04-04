
import { supabase } from '@/integrations/supabase/client';
import { initializeCountries } from './initializeCountries';
import { clearCountriesCache } from '@/hooks/countries/countriesCache';

/**
 * Initialize the app
 * This function is called when the app starts
 */
export const initializeApp = async (): Promise<void> => {
  console.log("Initializing app...");
  
  try {
    // Only clear cache in development to ensure fresh data
    if (process.env.NODE_ENV === 'development') {
      console.log("Development mode detected, clearing countries cache...");
      clearCountriesCache();
    } else {
      console.log("Production mode, keeping existing cache if valid");
    }
    
    // Initialize Supabase countries data
    console.log("Loading countries data...");
    await initializeCountries();
    console.log("Countries data loaded successfully");
    
    // Check if user is already logged in
    console.log("Checking authentication status...");
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting auth session:', error);
    } else if (session) {
      console.log('User is already logged in:', session.user.email);
    } else {
      console.log('No active session found');
    }
    
    console.log("App initialization complete");
  } catch (error) {
    console.error('Error during app initialization:', error);
    // Don't throw error here to prevent app from crashing
    // Instead log it and continue
  }
};
