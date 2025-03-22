
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
    // Check if countries cache needs to be refreshed
    const cacheTimestamp = localStorage.getItem('countries_cache_timestamp');
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    // Clear countries cache if it's older than an hour or doesn't exist
    if (!cacheTimestamp || (now - parseInt(cacheTimestamp)) > oneHour) {
      console.log("Clearing countries cache for fresh data...");
      clearCountriesCache();
      localStorage.setItem('countries_cache_timestamp', now.toString());
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
