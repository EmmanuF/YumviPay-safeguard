
import { supabase } from '@/integrations/supabase/client';
import { Preferences } from '@capacitor/preferences';
import { 
  AUTH_STATE_KEY, 
  LAST_AUTH_CHECK_KEY, 
  CACHED_AUTH_STATE_KEY,
  SESSION_EXPIRES_AT_KEY 
} from './constants';

// Log out user
export const logoutUser = async (): Promise<void> => {
  try {
    console.log('Logging out user...');
    
    // First clear local storage data before the Supabase signOut
    // to ensure we don't have any race conditions
    await Preferences.set({
      key: AUTH_STATE_KEY,
      value: JSON.stringify({
        user: null,
        isAuthenticated: false,
        hasCompletedOnboarding: true, // Keep onboarding state
        sessionExpiresAt: null,
      }),
    });
    
    // Also clear any auth cache we might have
    localStorage.removeItem(LAST_AUTH_CHECK_KEY);
    localStorage.removeItem(CACHED_AUTH_STATE_KEY);
    localStorage.removeItem(SESSION_EXPIRES_AT_KEY);
    
    // Now sign out from Supabase
    const { error } = await supabase.auth.signOut({
      scope: 'local' // Only sign out on this device
    });
    
    if (error) {
      console.error('Error during sign out from Supabase:', error);
      throw error;
    }
    
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error logging out:', error);
    throw new Error('Logout failed');
  }
};
