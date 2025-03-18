
import { supabase } from "@/integrations/supabase/client";
import { AdminCountry } from "./types";

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
    
    return parseCountryData(data || []);
  } catch (error) {
    console.error('Error in getAdminCountries:', error);
    return [];
  }
};

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
      const parsedCountry = parseCountryData([data])[0];
      return parsedCountry;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching country ${code}:`, error);
    return null;
  }
};
