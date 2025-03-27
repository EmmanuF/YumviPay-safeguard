import { supabase } from '@/integrations/supabase/client';
import { Preferences } from '@capacitor/preferences';
import { AUTH_STATE_KEY, CACHED_AUTH_STATE_KEY, LAST_AUTH_CHECK_KEY } from './constants';

// Get auth state from Supabase and storage
export const getAuthState = async (): Promise<any> => {
  try {
    console.log('Getting auth state...');
    
    // First check Supabase session with a timeout
    const sessionPromise = supabase.auth.getSession();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Session check timed out')), 8000);
    });
    
    // Race the session check against a timeout
    const { data: { session } } = await Promise.race([
      sessionPromise,
      timeoutPromise
    ]) as any;
    
    // If we have a session, update the local storage timestamps
    if (session) {
      localStorage.setItem(LAST_AUTH_CHECK_KEY, Date.now().toString());
      localStorage.setItem(CACHED_AUTH_STATE_KEY, 'authenticated');
    }
    
    // Get additional state from local storage
    const { value } = await Preferences.get({ key: AUTH_STATE_KEY });
    const localState = value ? JSON.parse(value) : { 
      user: null, 
      isAuthenticated: false, 
      hasCompletedOnboarding: false 
    };
    
    if (session && session.user) {
      // Get user profile from Supabase only if we need to
      let profile;
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        profile = data;
      } catch (e) {
        console.warn('Could not fetch profile', e);
      }
      
      // Update our auth state
      const authState = {
        user: {
          id: session.user.id,
          name: profile?.full_name || session.user.user_metadata?.full_name || 'User',
          email: session.user.email,
          phone: profile?.phone_number || session.user.user_metadata?.phone_number,
          country: profile?.country_code || session.user.user_metadata?.country_code,
        },
        isAuthenticated: true,
        hasCompletedOnboarding: localState.hasCompletedOnboarding
      };
      
      // Update local storage with current auth state
      await Preferences.set({
        key: AUTH_STATE_KEY,
        value: JSON.stringify(authState)
      });
      
      return authState;
    }
    
    // If no session but local state says authenticated, handle this conflict
    if (!session && localState.isAuthenticated) {
      console.warn('Session not found but local state says authenticated. Clearing local state.');
      await Preferences.set({
        key: AUTH_STATE_KEY,
        value: JSON.stringify({
          user: null,
          isAuthenticated: false,
          hasCompletedOnboarding: localState.hasCompletedOnboarding
        })
      });
      localStorage.removeItem(CACHED_AUTH_STATE_KEY);
    }
    
    return localState.isAuthenticated ? localState : {
      user: null,
      isAuthenticated: false,
      hasCompletedOnboarding: localState.hasCompletedOnboarding
    };
  } catch (error) {
    console.error('Error getting auth state:', error);
    
    // If there's an error, try to use cached state
    const { value } = await Preferences.get({ key: AUTH_STATE_KEY });
    if (value) {
      const cachedState = JSON.parse(value);
      const lastCheck = parseInt(localStorage.getItem(LAST_AUTH_CHECK_KEY) || '0');
      const isRecentCheck = Date.now() - lastCheck < 30 * 60 * 1000; // 30 minutes
      
      // Only trust cached state if it's recent
      if (isRecentCheck && cachedState.isAuthenticated) {
        console.log('Using cached auth state due to error');
        return cachedState;
      }
    }
    
    // Otherwise return unauthenticated state but preserve onboarding status
    const { value: onboardingValue } = await Preferences.get({ key: AUTH_STATE_KEY });
    const hasCompletedOnboarding = onboardingValue ? JSON.parse(onboardingValue).hasCompletedOnboarding : false;
    
    return {
      user: null,
      isAuthenticated: false,
      hasCompletedOnboarding
    };
  }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    // Check for cached state first for better performance
    const lastCheck = parseInt(localStorage.getItem(LAST_AUTH_CHECK_KEY) || '0');
    const isFresh = Date.now() - lastCheck < 5 * 60 * 1000; // 5 minutes
    
    if (isFresh && localStorage.getItem(CACHED_AUTH_STATE_KEY) === 'authenticated') {
      return true;
    }
    
    // If no fresh cache, check with Supabase but with a timeout
    const sessionPromise = supabase.auth.getSession();
    const timeoutPromise = new Promise<{data: {session: null}}>((resolve) => {
      setTimeout(() => resolve({data: {session: null}}), 5000);
    });
    
    const { data } = await Promise.race([sessionPromise, timeoutPromise]);
    const isAuth = !!data.session;
    
    // Update cache
    localStorage.setItem(LAST_AUTH_CHECK_KEY, Date.now().toString());
    localStorage.setItem(CACHED_AUTH_STATE_KEY, isAuth ? 'authenticated' : 'unauthenticated');
    
    return isAuth;
  } catch (error) {
    console.error('Error checking authentication:', error);
    
    // Try to use cached state if available
    const cachedState = localStorage.getItem(CACHED_AUTH_STATE_KEY);
    const lastCheck = parseInt(localStorage.getItem(LAST_AUTH_CHECK_KEY) || '0');
    const isRecentCache = lastCheck && (Date.now() - lastCheck < 60 * 60 * 1000); // 60 minutes
    
    if (cachedState === 'authenticated' && isRecentCache) {
      console.log('Using cached auth status due to error');
      return true;
    }
    
    return false;
  }
};

// Get current authenticated user
export const getCurrentUser = async (): Promise<any> => {
  try {
    const authState = await getAuthState();
    return authState.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};
