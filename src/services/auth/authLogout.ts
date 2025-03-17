
import { supabase } from '@/integrations/supabase/client';
import { Preferences } from '@capacitor/preferences';

// Keys for storage
const AUTH_STATE_KEY = 'yumvi_auth_state';

// Log out user
export const logoutUser = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear local storage data as well
    await Preferences.set({
      key: AUTH_STATE_KEY,
      value: JSON.stringify({
        user: null,
        isAuthenticated: false,
        hasCompletedOnboarding: true, // Keep onboarding state
      }),
    });
  } catch (error) {
    console.error('Error logging out:', error);
    throw new Error('Logout failed');
  }
};
