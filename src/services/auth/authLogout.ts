
import { supabase } from '@/integrations/supabase/client';
import { Preferences } from '@capacitor/preferences';

// Keys for storage
const AUTH_STATE_KEY = 'yumvi_auth_state';

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
      }),
    });
    
    // Also clear any auth cache we might have
    localStorage.removeItem('lastAuthCheck');
    localStorage.removeItem('cachedAuthState');
    
    // Now sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Final cleanup of any session data
    localStorage.removeItem('sessionExpiresAt');
    
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error logging out:', error);
    throw new Error('Logout failed');
  }
};
