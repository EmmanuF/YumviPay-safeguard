
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface AdminCountry {
  code: string;
  name: string;
  currency: string;
  currency_symbol: string;
  flag_emoji: string;
  is_sending_enabled: boolean;
  is_receiving_enabled: boolean;
  payment_methods: any[];
}

/**
 * Get all countries for admin
 */
export const getAdminCountries = async (): Promise<AdminCountry[]> => {
  console.log('Fetching admin countries list...');
  
  try {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    // Transform the data to ensure payment_methods is always an array
    return (data || []).map(country => ({
      ...country,
      payment_methods: Array.isArray(country.payment_methods) 
        ? country.payment_methods 
        : JSON.parse(country.payment_methods?.toString() || '[]')
    }));
  } catch (error) {
    console.error('Error fetching admin countries:', error);
    return [];
  }
};

/**
 * Update country settings
 */
export const updateCountrySettings = async (
  code: string, 
  updates: Partial<AdminCountry>
): Promise<boolean> => {
  console.log(`Updating country ${code}:`, updates);
  
  try {
    const { error } = await supabase
      .from('countries')
      .update(updates)
      .eq('code', code);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating country settings:', error);
    return false;
  }
};

/**
 * Update country payment methods
 */
export const updateCountryPaymentMethods = async (
  code: string,
  paymentMethods: any[]
): Promise<boolean> => {
  console.log(`Updating payment methods for ${code}`, paymentMethods);
  
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

/**
 * Add new country
 */
export const addNewCountry = async (country: Partial<AdminCountry>): Promise<boolean> => {
  console.log('Adding new country:', country);
  
  try {
    // Validate required fields before submitting to database
    if (!country.code || !country.name || !country.currency || !country.currency_symbol) {
      console.error('Missing required fields for adding country');
      return false;
    }
    
    // Make sure payment_methods is initialized as an empty array if not provided
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

/**
 * Get country by code
 */
export const getCountryByCode = async (code: string): Promise<AdminCountry | null> => {
  console.log(`Fetching country with code ${code}`);
  
  try {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('code', code)
      .single();
    
    if (error) throw error;
    
    if (data) {
      return {
        ...data,
        payment_methods: Array.isArray(data.payment_methods) 
          ? data.payment_methods 
          : JSON.parse(data.payment_methods?.toString() || '[]')
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching country ${code}:`, error);
    return null;
  }
};

/**
 * Delete country
 */
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
