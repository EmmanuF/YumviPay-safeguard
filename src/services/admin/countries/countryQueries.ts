
import { supabase } from "@/integrations/supabase/client";
import { AdminCountry } from "./types";
import { parseCountryData } from "./utils";

/**
 * Fetches all countries from the database
 * with proper error handling and timeout
 */
export const getAdminCountries = async (): Promise<AdminCountry[]> => {
  console.log('Fetching admin countries list...');
  
  try {
    // Add timeout to prevent infinite loading
    const timeoutPromise = new Promise<{data: null, error: Error}>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 10000);
    });

    const fetchPromise = supabase
      .from('countries')
      .select('*')
      .order('name');

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
    
    // Process countries data with proper parsing and rule enforcement
    const countries = parseCountryData(data || []);
    
    // Log sending and receiving countries for debugging
    const sendingCountries = countries.filter(c => c.is_sending_enabled);
    const receivingCountries = countries.filter(c => c.is_receiving_enabled);
    
    console.log(`Admin countries: ${countries.length} total, ${sendingCountries.length} sending, ${receivingCountries.length} receiving`);
    
    if (sendingCountries.length === 0) {
      console.warn('No sending countries found. This might indicate an issue with country rules enforcement');
    }
    
    return countries;
  } catch (error) {
    console.error('Error in getAdminCountries:', error);
    return [];
  }
};

/**
 * Fetches a single country by code
 * with proper error handling and timeout
 */
export const getCountryByCode = async (code: string): Promise<AdminCountry | null> => {
  console.log(`Fetching country with code ${code}`);
  
  if (!code) {
    console.error('Invalid country code provided');
    return null;
  }
  
  try {
    const timeoutPromise = new Promise<{data: null, error: Error}>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 5000);
    });

    const fetchPromise = supabase
      .from('countries')
      .select('*')
      .eq('code', code)
      .single();

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (error) {
      console.error(`Error fetching country ${code}:`, error);
      return null;
    }
    
    if (data) {
      // Parse the country data with proper type handling
      const parsedCountry = parseCountryData([data])[0];
      return parsedCountry;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching country ${code}:`, error);
    return null;
  }
};
