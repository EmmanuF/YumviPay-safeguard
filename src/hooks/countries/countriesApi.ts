
import { supabase } from "@/integrations/supabase/client";
import { Country } from '../../types/country';
import { parsePaymentMethods } from './parseCountryData';
import { enforceClientCountryRules } from '@/utils/countries/countryRules';

/**
 * Fetches countries from Supabase API
 * Uses centralized rule enforcement
 */
export const fetchCountriesFromApi = async (): Promise<Country[] | null> => {
  try {
    console.log('Fetching all countries from Supabase...');
    
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Error fetching countries from Supabase:', error);
      throw error;
    }
    
    if (data && data.length > 0) {
      console.log(`Fetched ${data.length} countries from Supabase`);
      
      const countries = data.map(country => ({
        name: country.name,
        code: country.code,
        currency: country.currency,
        flagUrl: `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`,
        isSendingEnabled: country.is_sending_enabled,
        isReceivingEnabled: country.is_receiving_enabled,
        paymentMethods: parsePaymentMethods(country.payment_methods)
      }));
      
      // Apply consistent rule enforcement to all countries
      return countries.map(enforceClientCountryRules);
    }
    
    console.log('No countries data returned from Supabase');
    return null;
  } catch (error) {
    console.error('Error fetching countries from Supabase:', error);
    return null;
  }
};

/**
 * Fetches only sending countries from Supabase
 * Uses centralized rule enforcement
 */
export const fetchSendingCountriesFromApi = async (): Promise<Country[] | null> => {
  try {
    console.log('Fetching sending countries from Supabase...');
    
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('is_sending_enabled', true)
      .order('name');
      
    if (error) {
      console.error('Error fetching sending countries from Supabase:', error);
      throw error;
    }
    
    if (data && data.length > 0) {
      console.log(`Fetched ${data.length} sending countries from Supabase`);
      
      const countries = data.map(country => ({
        name: country.name,
        code: country.code,
        currency: country.currency,
        flagUrl: `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`,
        isSendingEnabled: country.is_sending_enabled,
        isReceivingEnabled: country.is_receiving_enabled,
        paymentMethods: parsePaymentMethods(country.payment_methods)
      }));
      
      // Apply consistent rule enforcement to all countries
      return countries.map(enforceClientCountryRules).filter(c => c.isSendingEnabled);
    }
    
    console.log('No sending countries data returned from Supabase');
    return null;
  } catch (error) {
    console.error('Error fetching sending countries from Supabase:', error);
    return null;
  }
};

/**
 * Fetches only receiving countries from Supabase
 * Uses centralized rule enforcement
 */
export const fetchReceivingCountriesFromApi = async (): Promise<Country[] | null> => {
  try {
    console.log('Fetching receiving countries from Supabase...');
    
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('is_receiving_enabled', true)
      .order('name');
      
    if (error) {
      console.error('Error fetching receiving countries from Supabase:', error);
      throw error;
    }
    
    if (data && data.length > 0) {
      console.log(`Fetched ${data.length} receiving countries from Supabase`);
      
      const countries = data.map(country => ({
        name: country.name,
        code: country.code,
        currency: country.currency,
        flagUrl: `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`,
        isSendingEnabled: country.is_sending_enabled,
        isReceivingEnabled: country.is_receiving_enabled,
        paymentMethods: parsePaymentMethods(country.payment_methods)
      }));
      
      // Apply consistent rule enforcement to all countries
      return countries.map(enforceClientCountryRules).filter(c => c.isReceivingEnabled);
    }
    
    console.log('No receiving countries data returned from Supabase');
    return null;
  } catch (error) {
    console.error('Error fetching receiving countries from Supabase:', error);
    return null;
  }
};
