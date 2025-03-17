
import { supabase } from '@/integrations/supabase/client';
import { Preferences } from '@capacitor/preferences';

// Keys for storage
const ORIGINAL_EMAIL_KEY = 'original_email';

// Register a new user
export const registerUser = async (
  name: string,
  email: string,
  phone: string,
  country: string,
  password?: string // Make password optional to maintain backward compatibility
): Promise<any> => {
  try {
    console.log('Registering user with:', { name, email, phone, country });
    
    // First, clean the email (trim and lowercase)
    const cleanedEmail = email.trim().toLowerCase();
    
    // Basic email validation - use a simple check to avoid fighting with Supabase validation
    if (!cleanedEmail.includes('@') || !cleanedEmail.includes('.')) {
      throw new Error('Please enter a valid email address');
    }
    
    // Store the original email for future logins
    await Preferences.set({
      key: ORIGINAL_EMAIL_KEY,
      value: cleanedEmail
    });
    
    // Use the original email as is - no more modification
    let finalEmail = cleanedEmail;
    
    // Prepare user metadata - only include phone if provided
    const userData: Record<string, string> = {
      full_name: name,
      country_code: country,
    };
    
    // Only add phone_number to metadata if it's provided
    if (phone) {
      userData.phone_number = phone;
    }
    
    // Use provided password or generate a secure random one if not provided
    let userPassword = password;
    if (!userPassword) {
      const randomPart = Math.random().toString(36).substring(2, 10);
      userPassword = `YumviUser_${randomPart}`;
      console.log('Generated random password as none was provided');
    }
    
    console.log('Attempting signup with:', { email: finalEmail }); 
    
    const { data, error } = await supabase.auth.signUp({
      email: finalEmail,
      password: userPassword,
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
