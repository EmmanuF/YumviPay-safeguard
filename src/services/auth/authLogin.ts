
import { supabase } from '@/integrations/supabase/client';

// Sign in user
export const signInUser = async (email: string, password: string): Promise<any> => {
  try {
    console.log('Attempting to sign in with provided email:', email);
    
    // Always use the email as provided by the user, without modifications
    const cleanedEmail = email.trim().toLowerCase();
    
    // Check if we're online before attempting to sign in
    if (!navigator.onLine) {
      throw new Error('You are currently offline. Please check your internet connection and try again.');
    }
    
    // Add timeout to the Supabase auth request
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 20000); // 20 second timeout
    
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

      return data.user;
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // Handle network-related errors
      if (fetchError.name === 'AbortError') {
        throw new Error('Login request timed out. Please try again.');
      } else if (fetchError.message?.includes('fetch')) {
        throw new Error('Unable to connect to authentication service. Please check your internet connection.');
      }
      
      throw fetchError; // Re-throw if it's not a network error
    }
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(error.message || 'Sign in failed. Please check your credentials.');
  }
};
