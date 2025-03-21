
import { AdminCountry, AdminPaymentMethod } from "./types";
import { Json } from "@/integrations/supabase/types";
import { enforceCountryRules } from "@/utils/countryRules";
import { logKeyCountriesStatus } from "@/utils/countryRules";

/**
 * Parse raw country data from database into AdminCountry objects
 * with proper type handling
 */
export const parseCountryData = (data: any[]): AdminCountry[] => {
  const parsedCountries = data.map(country => {
    let parsedMethods: AdminPaymentMethod[] = [];
    
    try {
      // Handle various formats of payment_methods data
      if (Array.isArray(country.payment_methods)) {
        parsedMethods = country.payment_methods;
      } else if (typeof country.payment_methods === 'string') {
        parsedMethods = JSON.parse(country.payment_methods || '[]');
      } else if (country.payment_methods && typeof country.payment_methods === 'object') {
        parsedMethods = country.payment_methods;
      }
    } catch (e) {
      console.error(`Error parsing payment methods for ${country.code}:`, e);
    }
    
    // Create a properly typed AdminCountry object
    const parsedCountry: AdminCountry = {
      code: country.code,
      name: country.name,
      currency: country.currency || '',
      currency_symbol: country.currency_symbol || '',
      flag_emoji: country.flag_emoji || '🌐',
      is_sending_enabled: Boolean(country.is_sending_enabled),
      is_receiving_enabled: Boolean(country.is_receiving_enabled),
      payment_methods: parsedMethods as unknown as Json,
      phone_prefix: country.phone_prefix
    };
    
    // Apply centralized country rules to ensure correct sending/receiving flags
    return enforceCountryRules(parsedCountry);
  });

  // Log status for debugging
  logKeyCountriesStatus(parsedCountries, 'ADMIN PARSE');
  
  return parsedCountries;
};
