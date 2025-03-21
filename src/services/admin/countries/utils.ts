
import { AdminCountry, AdminPaymentMethod, enforceCountryRules } from "./types";
import { Json } from "@/integrations/supabase/types";

export const parseCountryData = (data: any[]): AdminCountry[] => {
  return data.map(country => {
    let parsedMethods: AdminPaymentMethod[] = [];
    
    try {
      // Handle various formats of payment_methods data
      if (Array.isArray(country.payment_methods)) {
        parsedMethods = country.payment_methods;
      } else if (typeof country.payment_methods === 'string') {
        parsedMethods = JSON.parse(country.payment_methods || '[]');
      } else if (country.payment_methods && typeof country.payment_methods === 'object') {
        if (Object.keys(country.payment_methods).length > 0) {
          // It could be an object with numeric keys as array-like
          const values = Object.values(country.payment_methods);
          if (Array.isArray(values)) {
            parsedMethods = values as AdminPaymentMethod[];
          } else {
            parsedMethods = [country.payment_methods as AdminPaymentMethod];
          }
        }
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
    
    // Apply country rules to ensure correct sending/receiving flags
    return enforceCountryRules(parsedCountry);
  });
};

/**
 * Normalize payment methods array to ensure consistent format
 * Converts any valid payment method format to the expected AdminPaymentMethod format
 */
export const normalizePaymentMethods = (methods: any): AdminPaymentMethod[] => {
  if (!methods) return [];
  
  // If methods is a string, try to parse it as JSON
  if (typeof methods === 'string') {
    try {
      methods = JSON.parse(methods);
    } catch (e) {
      console.error('Error parsing payment methods:', e);
      return [];
    }
  }
  
  // If methods is not an array, try to convert it to an array if possible
  if (!Array.isArray(methods)) {
    // If it's an object with numeric keys, it might be an array-like object
    if (typeof methods === 'object' && methods !== null) {
      try {
        const values = Object.values(methods);
        if (Array.isArray(values)) {
          methods = values;
        } else {
          return [];
        }
      } catch (e) {
        console.error('Error converting methods to array:', e);
        return [];
      }
    } else {
      return [];
    }
  }
  
  // Map to ensure all fields exist with standardized structure
  return methods.map((method: any) => ({
    id: method.id || method.method_id || '',
    name: method.name || '',
    description: method.description || '',
    icon: method.icon || 'credit-card',
    fees: method.fees || '',
    processingTime: method.processingTime || method.processing_time || ''
  }));
};
