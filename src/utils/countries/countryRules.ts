import { Country } from '@/types/country';
import { AdminCountry } from '@/services/admin/countries/types';

// Define constant arrays of country codes to ensure proper flags
export const AFRICAN_COUNTRY_CODES = [
  'CM', 'GH', 'NG', 'SN', 'CI', 'BJ', 'TG', 'BF', 'ML', 'NE', 
  'GW', 'GN', 'SL', 'LR', 'CD', 'GA', 'TD', 'CF', 'CG', 'GQ'
];

// Define sending countries explicitly - ensure they're always sending countries
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
 * Enforces country rules consistently for client Country objects
 * This is the centralized rule enforcement function for the client side
 */
export function enforceClientCountryRules(country: Country): Country {
  // If country is African, it can never be a sending country
  if (AFRICAN_COUNTRY_CODES.includes(country.code)) {
    return {
      ...country,
      isSendingEnabled: false,
      isReceivingEnabled: true
    };
  }
  
  // If country is in explicit sending list, ensure it's marked as sending
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
 * Enforces country rules consistently for admin AdminCountry objects
 * This is the centralized rule enforcement function for the admin side
 */
export function enforceAdminCountryRules(country: AdminCountry): AdminCountry {
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

/**
 * Convert AdminCountry to client Country format
 * Ensures consistent mapping between admin and client data models
 */
export function adminToClientCountry(adminCountry: AdminCountry): Country {
  // Convert payment methods from Json type to PaymentMethod[]
  const paymentMethods = Array.isArray(adminCountry.payment_methods) 
    ? adminCountry.payment_methods.map(method => ({
        id: method.id || '',
        name: method.name || '',
        description: method.description || '',
        icon: method.icon || 'credit-card',
        fees: method.fees || '',
        processingTime: method.processingTime || ''
      }))
    : [];

  // Map the admin country to client country format
  const clientCountry: Country = {
    name: adminCountry.name,
    code: adminCountry.code,
    flagUrl: `https://flagcdn.com/w80/${adminCountry.code.toLowerCase()}.png`,
    currency: adminCountry.currency,
    isSendingEnabled: adminCountry.is_sending_enabled,
    isReceivingEnabled: adminCountry.is_receiving_enabled,
    paymentMethods: paymentMethods
  };

  // Apply client-side rules to ensure consistency
  return enforceClientCountryRules(clientCountry);
}
