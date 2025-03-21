
import { Json } from "@/integrations/supabase/types";
import { 
  AFRICAN_COUNTRY_CODES,
  SENDING_COUNTRIES,
  enforceCountryRules as centralEnforceCountryRules
} from "@/utils/countryRules";

/**
 * AdminCountry type definition
 * Central type for admin country operations
 */
export interface AdminCountry {
  code: string;
  name: string;
  currency: string;
  currency_symbol: string;
  flag_emoji: string;
  is_sending_enabled: boolean;
  is_receiving_enabled: boolean;
  payment_methods: Json;
  phone_prefix?: string; // Added to match database schema
}

/**
 * PaymentMethod interface for frontend use
 */
export interface AdminPaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  fees: string;
  processingTime: string;
}

/**
 * Re-export constants from the central utility
 */
export { AFRICAN_COUNTRY_CODES, SENDING_COUNTRIES };

/**
 * Wrapper for the central enforcement function that maintains type compatibility
 * with the AdminCountry type
 */
export function enforceCountryRules(country: AdminCountry): AdminCountry {
  return centralEnforceCountryRules(country) as AdminCountry;
}
