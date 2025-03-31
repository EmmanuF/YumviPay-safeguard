
import { supabase } from '@/integrations/supabase/client';

// Request password reset
export const resetUserPassword = async (email: string): Promise<void> => {
  try {
    console.log('Requesting password reset for:', email);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
    
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error in resetUserPassword:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Update password (used after password reset)
export const updateUserPassword = async (password: string): Promise<void> => {
  try {
    console.log('Updating user password');
    
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    
    if (error) {
      console.error('Error updating password:', error);
      throw error;
    }
    
    console.log('Password updated successfully');
  } catch (error) {
    console.error('Error in updateUserPassword:', error);
    throw new Error('Failed to update password');
  }
};
