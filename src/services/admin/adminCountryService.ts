
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
    // Add timeout to prevent infinite loading
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 10000);
    });

    const fetchPromise = supabase
      .from('countries')
      .select('*')
      .order('name');

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;
    
    if (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
    
    // Transform the data with safe JSON parsing
    return (data || []).map(country => {
      let parsedMethods = [];
      try {
        parsedMethods = Array.isArray(country.payment_methods) 
          ? country.payment_methods 
          : JSON.parse(country.payment_methods?.toString() || '[]');
      } catch (e) {
        console.error(`Error parsing payment methods for ${country.code}:`, e);
      }
      
      return {
        ...country,
        payment_methods: parsedMethods
      };
    });
  } catch (error) {
    console.error('Error in getAdminCountries:', error);
    return [];
  }
};

/**
 * Update country settings with proper error handling
 */
export const updateCountrySettings = async (
  code: string, 
  updates: Partial<AdminCountry>
): Promise<boolean> => {
  console.log(`Updating country ${code}:`, updates);
  
  if (!code) {
    console.error('Country code is required for updates');
    return false;
  }
  
  try {
    console.log(`Sending update request for ${code} with:`, updates);
    
    const { data, error } = await supabase
      .from('countries')
      .update(updates)
      .eq('code', code)
      .select();
    
    if (error) {
      console.error('Error updating country settings:', error);
      return false;
    }
    
    console.log(`Update successful for ${code}:`, data);
    return true;
    
  } catch (error) {
    console.error('Exception in updateCountrySettings:', error);
    return false;
  }
};

/**
 * Update country payment methods with validation
 */
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

/**
 * Add new country with validation
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
 * Get country by code with timeout
 */
export const getCountryByCode = async (code: string): Promise<AdminCountry | null> => {
  console.log(`Fetching country with code ${code}`);
  
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 5000);
    });

    const fetchPromise = supabase
      .from('countries')
      .select('*')
      .eq('code', code)
      .single();

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;
    
    if (error) throw error;
    
    if (data) {
      let parsedMethods = [];
      try {
        parsedMethods = Array.isArray(data.payment_methods) 
          ? data.payment_methods 
          : JSON.parse(data.payment_methods?.toString() || '[]');
      } catch (e) {
        console.error(`Error parsing payment methods for ${code}:`, e);
      }
      
      return {
        ...data,
        payment_methods: parsedMethods
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching country ${code}:`, error);
    return null;
  }
};

/**
 * Delete country with confirmation
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
