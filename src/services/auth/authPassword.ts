
import { supabase } from '@/integrations/supabase/client';

/**
 * Request a password reset for a user email
 * @param email The email address of the user requesting password reset
 * @returns Promise with the result of the password reset request
 */
export const requestPasswordReset = async (email: string): Promise<{ data: any; error: Error | null }> => {
  try {
    console.log('Requesting password reset for:', email);
    
    // Use Supabase's password recovery feature
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error('Password reset error:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error: any) {
    console.error('Error requesting password reset:', error);
    return { data: null, error };
  }
};

/**
 * Update user's password with a new one
 * @param newPassword The new password to set for the user
 * @returns Promise with the update result
 */
export const updatePassword = async (newPassword: string): Promise<{ data: any; error: Error | null }> => {
  try {
    console.log('Updating password');
    
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('Password update error:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error: any) {
    console.error('Error updating password:', error);
    return { data: null, error };
  }
};
