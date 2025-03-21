import { Json } from "@/integrations/supabase/types";

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

// List of African country codes that should NEVER be sending countries
export const AFRICAN_COUNTRY_CODES = [
  'CM', 'GH', 'NG', 'SN', 'CI', 'BJ', 'TG', 'BF', 'ML', 'NE', 
  'GW', 'GN', 'SL', 'LR', 'CD', 'GA', 'TD', 'CF', 'CG', 'GQ'
];

// List of countries that should ALWAYS be sending countries
export const SENDING_COUNTRIES = [
  // North America
  'US', 'CA', 'MX', 'PA',
  // Europe
  'GB', 'FR', 'DE', 'IT', 'ES',
  // Middle East
  'AE', 'SA', 'QA', 'KW',
  // Asia Pacific
  'AU', 'JP', 'SG'
];

/**
 * Ensures that African countries are never marked as sending countries
 * and that designated sending countries are always marked correctly
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
