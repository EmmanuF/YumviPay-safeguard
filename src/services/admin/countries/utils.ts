
import { AdminCountry, AdminPaymentMethod } from "./types";
import { Json } from "@/integrations/supabase/types";
import { enforceCountryRules } from "@/utils/countryRules";
import { logKeyCountriesStatus } from "@/utils/countryRules";

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
    
    // Ensure the flag_emoji is never null or undefined for type compatibility
    const parsedCountry: AdminCountry = {
      ...country,
      flag_emoji: country.flag_emoji || '🌐', // Provide a default if missing
      // Use a type assertion to safely convert to Json type
      payment_methods: parsedMethods as unknown as Json 
    };
    
    // Apply centralized country rules to ensure correct sending/receiving flags
    return enforceCountryRules(parsedCountry) as AdminCountry;
  });

  // Log status of key countries for debugging
  logKeyCountriesStatus(parsedCountries, 'ADMIN PARSE');
  
  return parsedCountries;
};
