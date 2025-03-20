
import { supabase } from "@/integrations/supabase/client";
import { AdminCountry } from "./types";

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
    const { error } = await supabase
      .from('countries')
      .update(updates)
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
      .update({ payment_methods: paymentMethods })
      .eq('code', code);
    
    if (error) {
      console.error('Error updating country payment methods:', error);
      return false;
    }
    
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
    
    // Ensure payment_methods is always an array
    const paymentMethods = Array.isArray(country.payment_methods) ? country.payment_methods : [];
    
    const countryData = {
      code: country.code,
      name: country.name,
      currency: country.currency,
      currency_symbol: country.currency_symbol,
      flag_emoji: country.flag_emoji || null,
      is_sending_enabled: country.is_sending_enabled !== undefined ? country.is_sending_enabled : false,
      is_receiving_enabled: country.is_receiving_enabled !== undefined ? country.is_receiving_enabled : false,
      payment_methods: paymentMethods
    };
    
    // Check if country already exists
    const { data: existingCountry, error: checkError } = await supabase
      .from('countries')
      .select('code')
      .eq('code', country.code)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      console.error('Error checking if country exists:', checkError);
      return false;
    }
    
    if (existingCountry) {
      console.log(`Country with code ${country.code} already exists, updating instead`);
      const { error: updateError } = await supabase
        .from('countries')
        .update(countryData)
        .eq('code', country.code);
      
      if (updateError) {
        console.error('Error updating existing country:', updateError);
        return false;
      }
    } else {
      // Insert new country
      const { error: insertError } = await supabase
        .from('countries')
        .insert(countryData);
      
      if (insertError) {
        console.error('Error inserting new country:', insertError);
        return false;
      }
    }
    
    console.log(`Country ${country.code} successfully added/updated`);
    return true;
  } catch (error) {
    console.error('Exception in addNewCountry:', error);
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
