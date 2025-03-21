import { Json } from "@/integrations/supabase/types";
import { 
  AFRICAN_COUNTRY_CODES,
  SENDING_COUNTRIES,
  enforceCountryRules as centralEnforceCountryRules
} from "@/utils/countryRules";

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
