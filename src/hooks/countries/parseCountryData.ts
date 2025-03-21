
import { Country, PaymentMethod } from '@/types/country';

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
 */
export const mapApiCountryToAppCountry = (apiCountry: any): Country => {
  return {
    name: apiCountry.name,
    code: apiCountry.code,
    currency: apiCountry.currency,
    flagUrl: `https://flagcdn.com/w80/${apiCountry.code.toLowerCase()}.png`,
    isSendingEnabled: apiCountry.is_sending_enabled,
    isReceivingEnabled: apiCountry.is_receiving_enabled,
    paymentMethods: parsePaymentMethods(apiCountry.payment_methods),
    phonePrefix: apiCountry.phone_prefix
  };
};
