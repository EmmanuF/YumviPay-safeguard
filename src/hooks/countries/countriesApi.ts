
import { supabase } from "@/integrations/supabase/client";
import { Country } from '../../types/country';
import { parsePaymentMethods } from './parseCountryData';

/**
 * Fetches countries from Supabase API
 */
export const fetchCountriesFromApi = async (): Promise<Country[] | null> => {
  try {
    console.log("🔍 Starting fetchCountriesFromApi...");
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      console.log(`📥 fetchCountriesFromApi: Retrieved ${data.length} countries from Supabase`);
      console.log(`🔢 fetchCountriesFromApi: Sending countries count: ${data.filter(c => c.is_sending_enabled).length}`);
      
      const countries = data.map(country => ({
        name: country.name,
        code: country.code,
        currency: country.currency,
        flagUrl: `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`,
        isSendingEnabled: country.is_sending_enabled,
        isReceivingEnabled: country.is_receiving_enabled,
        paymentMethods: parsePaymentMethods(country.payment_methods)
      }));
      
      console.log(`✅ fetchCountriesFromApi: Transformed ${countries.length} countries`);
      console.log(`🔢 fetchCountriesFromApi: Transformed sending countries: ${countries.filter(c => c.isSendingEnabled).length}`);
      return countries;
    }
    
    console.log("❌ fetchCountriesFromApi: No countries found in database");
    return null;
  } catch (error) {
    console.error('❌ Error fetching countries from Supabase:', error);
    return null;
  }
};

/**
 * Fetches only sending countries from Supabase
 */
export const fetchSendingCountriesFromApi = async (): Promise<Country[] | null> => {
  try {
    console.log("🔍 Starting fetchSendingCountriesFromApi...");
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('is_sending_enabled', true)
      .order('name');
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      console.log(`📥 fetchSendingCountriesFromApi: Retrieved ${data.length} sending countries from Supabase`);
      
      const countries = data.map(country => ({
        name: country.name,
        code: country.code,
        currency: country.currency,
        flagUrl: `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`,
        isSendingEnabled: country.is_sending_enabled,
        isReceivingEnabled: country.is_receiving_enabled,
        paymentMethods: parsePaymentMethods(country.payment_methods)
      }));
      
      console.log(`✅ fetchSendingCountriesFromApi: Transformed ${countries.length} sending countries`);
      return countries;
    }
    
    console.log("❌ fetchSendingCountriesFromApi: No sending countries found in database");
    return null;
  } catch (error) {
    console.error('❌ Error fetching sending countries from Supabase:', error);
    return null;
  }
};

/**
 * Fetches only receiving countries from Supabase
 */
export const fetchReceivingCountriesFromApi = async (): Promise<Country[] | null> => {
  try {
    console.log("🔍 Starting fetchReceivingCountriesFromApi...");
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('is_receiving_enabled', true)
      .order('name');
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      console.log(`📥 fetchReceivingCountriesFromApi: Retrieved ${data.length} receiving countries from Supabase`);
      
      const countries = data.map(country => ({
        name: country.name,
        code: country.code,
        currency: country.currency,
        flagUrl: `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`,
        isSendingEnabled: country.is_sending_enabled,
        isReceivingEnabled: country.is_receiving_enabled,
        paymentMethods: parsePaymentMethods(country.payment_methods)
      }));
      
      console.log(`✅ fetchReceivingCountriesFromApi: Transformed ${countries.length} receiving countries`);
      return countries;
    }
    
    console.log("❌ fetchReceivingCountriesFromApi: No receiving countries found in database");
    return null;
  } catch (error) {
    console.error('❌ Error fetching receiving countries from Supabase:', error);
    return null;
  }
};
