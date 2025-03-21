
import { supabase } from "@/integrations/supabase/client";
import { AdminCountry } from "./types";
import { Json } from "@/integrations/supabase/types";
import { canBeSendingCountry } from "@/utils/countryRules";

/**
 * Updates a country's settings with proper validation and type safety
 */
export const updateCountrySettings = async (
  code: string, 
  updates: Partial<AdminCountry>
): Promise<boolean> => {
  console.log(`Updating country ${code} with settings:`, updates);
  
  if (!code) {
    console.error('Country code is required for updates');
    return false;
  }
  
  try {
    // Apply centralized rules before saving to database
    let finalUpdates: Record<string, any> = { ...updates };
    
    // Never allow African countries to be sending countries
    if ('is_sending_enabled' in finalUpdates && 
        finalUpdates.is_sending_enabled === true && 
        !canBeSendingCountry(code)) {
      console.warn(`Prevented country ${code} from being set as a sending country (blocked by rules)`);
      finalUpdates.is_sending_enabled = false;
    }
    
    // Handle payment_methods separately with proper type conversion
    if ('payment_methods' in finalUpdates) {
      const methods = finalUpdates.payment_methods;
      delete finalUpdates.payment_methods;
      
      // Update payment methods separately if they exist
      if (methods) {
        const methodsResult = await updateCountryPaymentMethods(code, methods as any);
        if (!methodsResult) {
          console.error(`Failed to update payment methods for ${code}`);
        }
      }
    }
    
    const { error } = await supabase
      .from('countries')
      .update(finalUpdates)
      .eq('code', code);
    
    if (error) {
      console.error('Error updating country settings:', error);
      return false;
    }
    
    console.log(`Update successful for ${code}`);
    return true;
    
  } catch (error) {
    console.error('Exception in updateCountrySettings:', error);
    return false;
  }
};

/**
 * Updates a country's payment methods with proper validation
 */
export const updateCountryPaymentMethods = async (
  code: string,
  paymentMethods: any[]
): Promise<boolean> => {
  console.log(`Updating payment methods for ${code}`, paymentMethods);
  
  if (!code) {
    console.error('Country code is required for payment method updates');
    return false;
  }
  
  if (!Array.isArray(paymentMethods)) {
    console.error('Invalid payment methods format');
    return false;
  }
  
  try {
    const { error } = await supabase
      .from('countries')
      .update({ payment_methods: paymentMethods as Json })
      .eq('code', code);
    
    if (error) {
      console.error(`Error updating payment methods for ${code}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating country payment methods:', error);
    return false;
  }
};

/**
 * Adds a new country with proper validation and type safety
 */
export const addNewCountry = async (country: Partial<AdminCountry>): Promise<boolean> => {
  console.log('Adding new country:', country);
  
  try {
    if (!country.code || !country.name || !country.currency || !country.currency_symbol) {
      console.error('Missing required fields for adding country');
      return false;
    }
    
    // Apply rules before saving
    let finalCountry = { ...country };
    
    // Never allow African countries to be sending countries
    if (!canBeSendingCountry(country.code) && finalCountry.is_sending_enabled === true) {
      console.warn(`Prevented country ${country.code} from being set as a sending country (blocked by rules)`);
      finalCountry.is_sending_enabled = false;
    }
    
    // Prepare country data for insertion, ensuring payment_methods is properly formatted
    const countryData = {
      code: finalCountry.code,
      name: finalCountry.name,
      currency: finalCountry.currency,
      currency_symbol: finalCountry.currency_symbol,
      flag_emoji: finalCountry.flag_emoji || '🌐', // Provide default
      is_sending_enabled: finalCountry.is_sending_enabled !== undefined ? finalCountry.is_sending_enabled : false,
      is_receiving_enabled: finalCountry.is_receiving_enabled !== undefined ? finalCountry.is_receiving_enabled : false,
      payment_methods: (finalCountry.payment_methods || []) as Json
    };
    
    const { error } = await supabase
      .from('countries')
      .insert(countryData);
    
    if (error) {
      console.error('Error adding country:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error adding country:', error);
    return false;
  }
};

/**
 * Deletes a country by code
 */
export const deleteCountry = async (code: string): Promise<boolean> => {
  console.log(`Deleting country ${code}`);
  
  if (!code) {
    console.error('Country code is required for deletion');
    return false;
  }
  
  try {
    const { error } = await supabase
      .from('countries')
      .delete()
      .eq('code', code);
    
    if (error) {
      console.error(`Error deleting country ${code}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting country ${code}:`, error);
    return false;
  }
};
