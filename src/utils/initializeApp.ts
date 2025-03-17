
import { supabase } from '@/integrations/supabase/client';
import { initializeCountries } from './initializeCountries';

/**
 * Initialize the app
 * This function is called when the app starts
 */
export const initializeApp = async (): Promise<void> => {
  console.log("Initializing app...");
  
  try {
    // Initialize Supabase countries data
    await initializeCountries();
    
    // Check if user is already logged in
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
    throw error;
  }
};
