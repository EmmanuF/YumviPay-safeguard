
import { supabase } from '@/integrations/supabase/client';

// Sign in user
export const signInUser = async (email: string, password: string): Promise<any> => {
  try {
    console.log('Attempting to sign in with provided email:', email);
    
    // Always use the email as provided by the user, without modifications
    const cleanedEmail = email.trim().toLowerCase();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanedEmail,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw new Error('Invalid login credentials. Please check your email and password.');
    }

    return data.user;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(error.message || 'Sign in failed. Please check your credentials.');
  }
};
