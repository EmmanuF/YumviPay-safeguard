
import { supabase } from "@/integrations/supabase/client";
import { Country } from '../../types/country';
import { parsePaymentMethods } from './parseCountryData';

/**
 * Fetches countries from Supabase API
 */
export const fetchCountriesFromApi = async (): Promise<Country[] | null> => {
  try {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map(country => ({
        name: country.name,
        code: country.code,
        currency: country.currency,
        flagUrl: `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`,
        isSendingEnabled: country.is_sending_enabled,
        isReceivingEnabled: country.is_receiving_enabled,
        paymentMethods: parsePaymentMethods(country.payment_methods)
      }));
    }
    return null;
  } catch (error) {
    console.error('Error fetching countries from Supabase:', error);
    return null;
  }
};

/**
 * Fetches only sending countries from Supabase
 */
export const fetchSendingCountriesFromApi = async (): Promise<Country[] | null> => {
  try {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('is_sending_enabled', true)
      .order('name');
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map(country => ({
        name: country.name,
        code: country.code,
        currency: country.currency,
        flagUrl: `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`,
        isSendingEnabled: country.is_sending_enabled,
        isReceivingEnabled: country.is_receiving_enabled,
        paymentMethods: parsePaymentMethods(country.payment_methods)
      }));
    }
    return null;
  } catch (error) {
    console.error('Error fetching sending countries from Supabase:', error);
    return null;
  }
};

/**
 * Fetches only receiving countries from Supabase
 */
export const fetchReceivingCountriesFromApi = async (): Promise<Country[] | null> => {
  try {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('is_receiving_enabled', true)
      .order('name');
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map(country => ({
        name: country.name,
        code: country.code,
        currency: country.currency,
        flagUrl: `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`,
        isSendingEnabled: country.is_sending_enabled,
        isReceivingEnabled: country.is_receiving_enabled,
        paymentMethods: parsePaymentMethods(country.payment_methods)
      }));
    }
    return null;
  } catch (error) {
    console.error('Error fetching receiving countries from Supabase:', error);
    return null;
  }
};
