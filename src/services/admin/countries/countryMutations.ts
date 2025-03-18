
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
    const { data, error } = await supabase
      .from('countries')
      .update(updates)
      .eq('code', code)
      .select();
    
    if (error) {
      console.error('Error updating country settings:', error);
      return false;
    }
    
    if (!data || data.length === 0) {
      console.error('No data returned after update');
      return false;
    }
    
    console.log(`Update successful for ${code}:`, data);
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
    
    const countryData = {
      code: country.code,
      name: country.name,
      currency: country.currency,
      currency_symbol: country.currency_symbol,
      flag_emoji: country.flag_emoji || null,
      is_sending_enabled: country.is_sending_enabled !== undefined ? country.is_sending_enabled : false,
      is_receiving_enabled: country.is_receiving_enabled !== undefined ? country.is_receiving_enabled : false,
      payment_methods: country.payment_methods || []
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
