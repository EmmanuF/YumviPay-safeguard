
import { Country, PaymentMethod } from '@/types/country';
import { enforceCountryRules } from '@/utils/countryRules';

/**
 * Parse payment methods data from various formats
 */
export const parsePaymentMethods = (data: any): PaymentMethod[] => {
  if (!data) return [];
  
  try {
    if (Array.isArray(data)) {
      return data;
    } else if (typeof data === 'string') {
      return JSON.parse(data);
    } else if (typeof data === 'object') {
      return Object.values(data);
    }
  } catch (e) {
    console.error('Error parsing payment methods:', e);
  }
  
  return [];
};

/**
 * Maps country data between the API format and our application format
 * Uses the central enforceCountryRules function
 */
export const mapApiCountryToAppCountry = (apiCountry: any): Country => {
  // Make sure we have a valid country code
  const code = apiCountry.code?.toUpperCase() || '';
  
  // Create the flag URL using the country code
  const flagUrl = code ? 
    `https://flagcdn.com/w80/${code.toLowerCase()}.png` : 
    '';
  
  // Log any issues with the country data for debugging
  if (!code) {
    console.warn('Country missing code:', apiCountry.name || 'Unknown country');
  }
  
  // Create the country object with the correct structure for our app
  const country: Country = {
    name: apiCountry.name || 'Unknown',
    code: code,
    currency: apiCountry.currency || '',
    flagUrl: flagUrl,
    isSendingEnabled: apiCountry.is_sending_enabled === true,
    isReceivingEnabled: apiCountry.is_receiving_enabled === true,
    paymentMethods: parsePaymentMethods(apiCountry.payment_methods),
    phonePrefix: apiCountry.phone_prefix || ''
  };
  
  // Apply the centralized country rules before returning
  return enforceCountryRules(country);
};
