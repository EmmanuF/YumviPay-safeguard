
import { supabase } from "@/integrations/supabase/client";

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
      .select('*');
    
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
 * Add new country
 */
export const addNewCountry = async (country: AdminCountry): Promise<boolean> => {
  console.log('Adding new country:', country);
  
  try {
    const { error } = await supabase
      .from('countries')
      .insert([country]);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error adding country:', error);
    return false;
  }
};
