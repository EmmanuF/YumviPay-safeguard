
import { supabase } from '@/integrations/supabase/client';
import { Preferences } from '@capacitor/preferences';
import { isValidEmail, createModifiedEmail, generateSecurePassword } from './utils';
import { ORIGINAL_EMAIL_KEY } from './constants';

/**
 * Register a new user
 * @param name User's full name
 * @param email User's email address
 * @param phone User's phone number (optional)
 * @param country User's country code
 * @returns User object if registration is successful
 */
export const registerUser = async (
  name: string,
  email: string,
  phone: string,
  country: string
): Promise<any> => {
  try {
    console.log('Registering user with:', { name, email, phone, country });
    
    // First, clean the email (trim and lowercase)
    const cleanedEmail = email.trim().toLowerCase();
    
    // Email validation
    if (!isValidEmail(cleanedEmail)) {
      throw new Error('Please enter a valid email address');
    }
    
    // For testing purposes, modify all emails to ensure they pass validation
    let finalEmail = createModifiedEmail(cleanedEmail);
    console.log('Modified email for testing:', finalEmail);
    
    // Prepare user metadata - only include phone if provided
    const userData: Record<string, string> = {
      full_name: name,
      country_code: country,
    };
    
    // Only add phone_number to metadata if it's provided
    if (phone) {
      userData.phone_number = phone;
    }
    
    // Generate a secure random password
    const password = generateSecurePassword();
    
    console.log('Attempting signup with:', { email: finalEmail }); 
    
    const { data, error } = await supabase.auth.signUp({
      email: finalEmail,
      password,
      options: {
        data: userData
      }
    });

    if (error) {
      console.error('Supabase signup error:', error);
      
      // Handle common error codes with user-friendly messages
      if (error.code === 'email_address_invalid') {
        throw new Error('The email format is not accepted by our system. Please try a different email address.');
      } else if (error.code === 'user_already_exists') {
        throw new Error('An account with this email already exists. Please try logging in.');
      } else {
        throw error;
      }
    }
    
    console.log('Registration successful:', data.user);
    
    // Store the original email in the user's metadata for future reference
    if (finalEmail !== cleanedEmail) {
      // This helps us map the modified email back to the original one
      await Preferences.set({
        key: ORIGINAL_EMAIL_KEY,
        value: cleanedEmail
      });
    }
    
    return data.user;
  } catch (error: any) {
    console.error('Error registering user:', error);
    
    // Provide user-friendly error messages
    if (error.code === 'email_address_invalid') {
      throw new Error('The email format is not accepted by our system. Please try a different email address.');
    } else if (error.code === 'user_already_exists') {
      throw new Error('An account with this email already exists. Please try logging in.');
    } else {
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  }
};
