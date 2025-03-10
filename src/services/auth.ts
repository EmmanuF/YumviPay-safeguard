
import { supabase } from '@/integrations/supabase/client';
import { Preferences } from '@capacitor/preferences';

// Keys for storage
const AUTH_STATE_KEY = 'yumvi_auth_state';

// Register a new user
export const registerUser = async (
  name: string,
  email: string,
  phone: string,
  country: string
): Promise<any> => {
  try {
    console.log('Registering user with:', { name, email, phone, country });
    
    // More comprehensive email validation
    // This regex follows RFC 5322 standard for email validation
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }
    
    // Clean the email address (remove leading/trailing spaces)
    const cleanedEmail = email.trim().toLowerCase();
    
    // Prepare user metadata - only include phone if provided
    const userData: Record<string, string> = {
      full_name: name,
      country_code: country,
    };
    
    // Only add phone_number to metadata if it's provided
    if (phone) {
      userData.phone_number = phone;
    }
    
    // Generate a more secure random password
    const randomPart = Math.random().toString(36).substring(2, 10);
    const password = `YumviUser_${randomPart}`;
    
    const { data, error } = await supabase.auth.signUp({
      email: cleanedEmail,
      password,
      options: {
        data: userData
      }
    });

    if (error) {
      console.error('Supabase signup error:', error);
      throw error;
    }
    
    console.log('Registration successful:', data.user);
    return data.user;
  } catch (error: any) {
    console.error('Error registering user:', error);
    
    // Provide user-friendly error messages
    if (error.code === 'email_address_invalid') {
      throw new Error('The email address format is invalid. Please check and try again.');
    } else if (error.code === 'user_already_exists') {
      throw new Error('An account with this email already exists. Please try logging in.');
    } else {
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  }
};

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

// Set onboarding complete
export const setOnboardingComplete = async (): Promise<void> => {
  try {
    const currentState = await getAuthState();
    await Preferences.set({
      key: AUTH_STATE_KEY,
      value: JSON.stringify({
        ...currentState,
        hasCompletedOnboarding: true,
      }),
    });
  } catch (error) {
    console.error('Error setting onboarding complete:', error);
  }
};

// Get auth state from Supabase and storage
export const getAuthState = async (): Promise<any> => {
  try {
    // First check Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    
    // Then get additional state from local storage
    const { value } = await Preferences.get({ key: AUTH_STATE_KEY });
    const localState = value ? JSON.parse(value) : { 
      user: null, 
      isAuthenticated: false, 
      hasCompletedOnboarding: false 
    };
    
    if (session && session.user) {
      // Get user profile from Supabase
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
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

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

// Check if onboarding is complete
export const hasCompletedOnboarding = async (): Promise<boolean> => {
  const { hasCompletedOnboarding } = await getAuthState();
  return hasCompletedOnboarding;
};
