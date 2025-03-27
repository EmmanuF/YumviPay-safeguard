
import { supabase } from '@/integrations/supabase/client';
import { Preferences } from '@capacitor/preferences';
import { 
  AUTH_STATE_KEY, 
  LAST_AUTH_CHECK_KEY, 
  CACHED_AUTH_STATE_KEY,
  SESSION_EXPIRES_AT_KEY 
} from './constants';

// Sign in user
export const signInUser = async (email: string, password: string): Promise<any> => {
  try {
    console.log('Attempting to sign in with provided email:', email);
    
    // Always use the email as provided by the user, without modifications
    const cleanedEmail = email.trim().toLowerCase();
    
    // Clear any previous auth cache to avoid state conflicts
    localStorage.removeItem(LAST_AUTH_CHECK_KEY);
    localStorage.removeItem(CACHED_AUTH_STATE_KEY);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanedEmail,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw new Error('Invalid login credentials. Please check your email and password.');
    }
    
    if (!data.session || !data.user) {
      console.error('No session or user returned from login');
      throw new Error('Login was successful but no session was created. Please try again.');
    }
    
    console.log('Login successful, session established:', !!data.session);
    
    // Immediately update local storage with the authenticated state
    await Preferences.set({
      key: AUTH_STATE_KEY,
      value: JSON.stringify({
        user: data.user,
        isAuthenticated: true,
        hasCompletedOnboarding: true,
        sessionExpiresAt: data.session.expires_at,
      }),
    });
    
    // Set a fresh timestamp for auth check
    localStorage.setItem(LAST_AUTH_CHECK_KEY, Date.now().toString());
    localStorage.setItem(CACHED_AUTH_STATE_KEY, 'authenticated');
    
    if (data.session) {
      // Store session expiration for better visibility
      const expiresAt = data.session.expires_at;
      if (expiresAt) {
        const expirationDate = new Date(expiresAt * 1000).toISOString();
        localStorage.setItem(SESSION_EXPIRES_AT_KEY, expirationDate);
        console.log('Session will expire at:', expirationDate);
      }
    }

    return data.user;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(error.message || 'Sign in failed. Please check your credentials.');
  }
};
