import { Country, PaymentMethod } from "@/types/country";
import { parsePaymentMethods } from "@/hooks/countries/parseCountryData";

/**
 * Constants for country categorization 
 * Exported to be used across the application
 */
export const AFRICAN_COUNTRY_CODES = ['CM', 'GH', 'NG', 'SN', 'KE', 'ZA', 'EG', 'MA', 'TZ', 'UG', 'RW', 'ET', 'CI'];
export const SENDING_COUNTRIES = ['US', 'CA', 'GB', 'FR', 'DE', 'ES', 'IT', 'AU', 'NZ', 'JP', 'SG', 'AE', 'CH'];

/**
 * Enforce country business rules for the client side Country object.
 * This ensures consistency regardless of what data comes from the server.
 */
export function enforceClientCountryRules(country: Country): Country {
  // Rule: African countries can NEVER be sending countries
  if (AFRICAN_COUNTRY_CODES.includes(country.code)) {
    return {
      ...country,
      isSendingEnabled: false,
      isReceivingEnabled: true // African countries are always receiving
    };
  }
  
  // Rule: Designated sending countries are always sending
  if (SENDING_COUNTRIES.includes(country.code)) {
    return {
      ...country,
      isSendingEnabled: true
    };
  }
  
  // Otherwise, leave as is
  return country;
}

/**
 * Apply country rules to an array of Countries
 */
export function enforceClientCountryRulesArray(countries: Country[]): Country[] {
  return countries.map(country => enforceClientCountryRules(country));
}

/**
 * Convert AdminCountry to frontend Country
 * Handles the transformation between the admin panel and frontend representations
 */
export function convertAdminToClientCountry(adminCountry: any): Country {
  let paymentMethods: PaymentMethod[] = [];
  
  // Process payment methods, handling different possible formats
  if (adminCountry.payment_methods) {
    paymentMethods = parsePaymentMethods(adminCountry.payment_methods);
  }
  
  const country: Country = {
    name: adminCountry.name,
    code: adminCountry.code,
    flagUrl: `https://flagcdn.com/${adminCountry.code.toLowerCase()}.svg`,
    currency: adminCountry.currency,
    isSendingEnabled: adminCountry.is_sending_enabled,
    isReceivingEnabled: adminCountry.is_receiving_enabled,
    phonePrefix: adminCountry.phone_prefix || '',
    paymentMethods
  };
  
  // Apply business rules to ensure consistency
  return enforceClientCountryRules(country);
}
