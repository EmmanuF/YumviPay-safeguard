
import { supabase } from "@/integrations/supabase/client";
import { AdminCountry, enforceCountryRules } from "./types";
import { AFRICAN_COUNTRY_CODES, SENDING_COUNTRIES } from "@/utils/countries/countryRules";
import { Json } from "@/integrations/supabase/types";

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
    // Apply country rules before saving to database
    let finalUpdates: Record<string, any> = { ...updates };
    
    // Never allow African countries to be sending countries
    if (AFRICAN_COUNTRY_CODES.includes(code) && finalUpdates.is_sending_enabled === true) {
      console.warn(`Prevented African country ${code} from being set as a sending country`);
      finalUpdates.is_sending_enabled = false;
    }
    
    // Remove payment_methods from updates if present to handle separately
    // as it needs special JSON handling
    if (finalUpdates.payment_methods) {
      delete finalUpdates.payment_methods;
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

export const updateCountryPaymentMethods = async (
  code: string,
  paymentMethods: any[]
): Promise<boolean> => {
  console.log(`Updating payment methods for ${code}`, paymentMethods);
  
  if (!Array.isArray(paymentMethods)) {
    console.error('Invalid payment methods format');
    return false;
  }
  
  try {
    const { error } = await supabase
      .from('countries')
      .update({ payment_methods: paymentMethods as Json })
      .eq('code', code);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating country payment methods:', error);
    return false;
  }
};

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
    if (AFRICAN_COUNTRY_CODES.includes(country.code) && finalCountry.is_sending_enabled === true) {
      console.warn(`Prevented African country ${country.code} from being set as a sending country`);
      finalCountry.is_sending_enabled = false;
    }
    
    // Prepare country data for insertion, ensuring payment_methods is properly formatted as Json
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
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error adding country:', error);
    return false;
  }
};

export const deleteCountry = async (code: string): Promise<boolean> => {
  console.log(`Deleting country ${code}`);
  
  try {
    const { error } = await supabase
      .from('countries')
      .delete()
      .eq('code', code);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error deleting country ${code}:`, error);
    return false;
  }
};
