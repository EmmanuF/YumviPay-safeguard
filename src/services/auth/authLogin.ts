
import { supabase } from '@/integrations/supabase/client';
import { Preferences } from '@capacitor/preferences';

// Keys for storage
const AUTH_STATE_KEY = 'yumvi_auth_state';

// Sign in user
export const signInUser = async (email: string, password: string): Promise<any> => {
  try {
    console.log('Attempting to sign in with provided email:', email);
    
    // Always use the email as provided by the user, without modifications
    const cleanedEmail = email.trim().toLowerCase();
    
    // Clear any previous auth cache to avoid state conflicts
    localStorage.removeItem('lastAuthCheck');
    localStorage.removeItem('cachedAuthState');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanedEmail,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw new Error('Invalid login credentials. Please check your email and password.');
    }
    
    // Immediately update local storage with the authenticated state
    await Preferences.set({
      key: AUTH_STATE_KEY,
      value: JSON.stringify({
        user: data.user,
        isAuthenticated: true,
        hasCompletedOnboarding: true,
      }),
    });
    
    // Set a fresh timestamp for auth check
    localStorage.setItem('lastAuthCheck', Date.now().toString());
    localStorage.setItem('cachedAuthState', 'authenticated');
    
    if (data.session) {
      // Store session expiration for better visibility
      const expiresAt = data.session.expires_at;
      if (expiresAt) {
        localStorage.setItem('sessionExpiresAt', new Date(expiresAt * 1000).toISOString());
      }
    }

    return data.user;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(error.message || 'Sign in failed. Please check your credentials.');
  }
};
