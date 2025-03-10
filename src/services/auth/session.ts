
import { supabase } from '@/integrations/supabase/client';
import { Preferences } from '@capacitor/preferences';
import { AUTH_STATE_KEY } from './constants';

/**
 * Get the current authentication state
 * @returns Object containing user, authentication status, and onboarding status
 */
export const getAuthState = async (): Promise<any> => {
  try {
    console.log('Getting auth state...');
    // First check Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Session from Supabase:', session ? 'Present' : 'None');
    
    // Then get additional state from local storage
    const { value } = await Preferences.get({ key: AUTH_STATE_KEY });
    const localState = value ? JSON.parse(value) : { 
      user: null, 
      isAuthenticated: false, 
      hasCompletedOnboarding: false 
    };
    console.log('Local auth state:', localState);
    
    if (session && session.user) {
      // Get user profile from Supabase
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      console.log('User profile found:', profile ? 'Yes' : 'No');
      
      return {
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
    }
    
    // For demo purposes in development, allow a mock authentication state
    // Remove this in production
    if (import.meta.env.DEV && localState.mockAuth) {
      console.log('Using mock authentication for development');
      return {
        user: localState.user || {
          id: 'mock-user-id',
          name: 'Demo User',
          email: 'demo@example.com',
          phone: '+1234567890',
          country: 'CM',
        },
        isAuthenticated: true,
        hasCompletedOnboarding: true
      };
    }
    
    console.log('No authenticated session found');
    return localState;
  } catch (error) {
    console.error('Error getting auth state:', error);
    // If there's an error, return an unauthenticated state but preserve onboarding status
    const { value } = await Preferences.get({ key: AUTH_STATE_KEY });
    const hasCompletedOnboarding = value ? JSON.parse(value).hasCompletedOnboarding : false;
    
    return {
      user: null,
      isAuthenticated: false,
      hasCompletedOnboarding
    };
  }
};

/**
 * Check if user is authenticated
 * @returns Boolean indicating if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  console.log('Checking authentication status:', !!data.session);
  return !!data.session;
};

/**
 * Enable mock authentication for development
 * This is for demo purposes only and should not be used in production
 */
export const enableMockAuth = async (mockUser: any = null): Promise<void> => {
  if (import.meta.env.DEV) {
    const defaultUser = {
      id: 'mock-user-id',
      name: 'Demo User',
      email: 'demo@example.com',
      phone: '+1234567890',
      country: 'CM',
    };
    
    await Preferences.set({
      key: AUTH_STATE_KEY,
      value: JSON.stringify({
        user: mockUser || defaultUser,
        isAuthenticated: true,
        hasCompletedOnboarding: true,
        mockAuth: true
      }),
    });
    
    console.log('Mock authentication enabled for development');
  }
};
