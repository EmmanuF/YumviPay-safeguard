
import { supabase } from '@/integrations/supabase/client';
import { createNetworkError } from '@/utils/errorHandling';

// Sign in user
export const signInUser = async (email: string, password: string): Promise<any> => {
  try {
    console.log('Attempting to sign in with provided email:', email);
    
    // Always use the email as provided by the user, without modifications
    const cleanedEmail = email.trim().toLowerCase();
    
    // Check if we're online before attempting to sign in
    if (!navigator.onLine) {
      throw createNetworkError(
        'You are currently offline. Please check your internet connection and try again.',
        'connection-error'
      );
    }
    
    // Add timeout to the Supabase auth request
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 30000); // 30 second timeout (increased from 20)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanedEmail,
        password,
      });
      
      clearTimeout(timeoutId);
      
      if (error) {
        console.error('Sign in error:', error);
        
        // Provide more user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid login credentials. Please check your email and password.');
        } else if (error.message.includes('too many requests')) {
          throw new Error('Too many login attempts. Please try again later.');
        } else if (error.message.includes('email') || error.message.includes('password')) {
          throw new Error('Invalid login credentials. Please check your email and password.');
        } else {
          throw new Error(error.message || 'Authentication failed. Please try again.');
        }
      }
      
      if (!data.user) {
        throw new Error('Authentication failed. No user data received.');
      }

      // Store session duration information for visibility
      if (data.session) {
        const expiresAt = data.session.expires_at;
        if (expiresAt) {
          const expiresAtDate = new Date(expiresAt * 1000);
          console.log('Session expires at:', expiresAtDate.toISOString());
          localStorage.setItem('sessionExpiresAt', expiresAtDate.toISOString());
        }
      }

      return data.user;
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // Handle network-related errors
      if (fetchError.name === 'AbortError') {
        throw createNetworkError(
          'Login request timed out. Please try again.',
          'timeout-error'
        );
      } else if (fetchError.message?.includes('fetch') || fetchError.message?.includes('Failed to fetch')) {
        throw createNetworkError(
          'Unable to connect to authentication service. Please check your internet connection.',
          'connection-error'
        );
      }
      
      throw fetchError; // Re-throw if it's not a network error
    }
  } catch (error: any) {
    console.error('Error signing in:', error);
    
    // Check if it's already a network error
    if (error.type) {
      throw error;
    }
    
    // Create a generic error if it's not already a network error
    throw new Error(error.message || 'Sign in failed. Please check your credentials.');
  }
};
