
import { Json } from "@/integrations/supabase/types";

/**
 * Constants for country categorization 
 * Exported to be used across the application
 */
export const AFRICAN_COUNTRY_CODES = ['CM', 'GH', 'NG', 'SN', 'KE', 'ZA', 'EG', 'MA', 'TZ', 'UG', 'RW', 'ET', 'CI'];
export const SENDING_COUNTRIES = ['US', 'CA', 'GB', 'FR', 'DE', 'ES', 'IT', 'AU', 'NZ', 'JP', 'SG', 'AE', 'CH'];

/**
 * AdminCountry type definition
 * Used for the admin panel only
 */
export interface AdminCountry {
  code: string;
  name: string;
  currency: string;
  currency_symbol: string;
  flag_emoji: string; // Changed from optional to required to match adminCountryService
  is_sending_enabled: boolean;
  is_receiving_enabled: boolean;
  payment_methods: Json; // Changed from AdminPaymentMethod[] to Json to match Supabase expectations
}

// Keeping this interface for frontend use, separate from database operations
export interface AdminPaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  fees: string;
  processingTime: string;
}

/**
 * Ensures that African countries are never marked as sending countries
 * and that designated sending countries are always marked correctly
 * This is now a wrapper around the centralized rules
 */
export function enforceCountryRules(country: AdminCountry): AdminCountry {
  // If country is African, force receiving-only
  if (AFRICAN_COUNTRY_CODES.includes(country.code)) {
    return {
      ...country,
      is_sending_enabled: false,
      is_receiving_enabled: true
    };
  }
  
  // If country is in explicit sending list, ensure it's marked as sending
  if (SENDING_COUNTRIES.includes(country.code)) {
    return {
      ...country,
      is_sending_enabled: true
    };
  }
  
  // Otherwise, leave as is
  return country;
}
