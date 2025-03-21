
import { PaymentMethod } from "@/types/country";

/**
 * Parses payment methods from Supabase data into PaymentMethod objects
 * Enhanced to handle all possible data formats consistently
 */
export const parsePaymentMethods = (methods: any): PaymentMethod[] => {
  // If methods is undefined or null, return empty array
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
  return methods.map(method => ({
    id: method.id || method.method_id || '',
    name: method.name || '',
    description: method.description || '',
    icon: method.icon || 'credit-card',
    fees: method.fees || '',
    processingTime: method.processingTime || method.processing_time || ''
  }));
};

/**
 * Transforms payment methods object into a format compatible with Supabase
 * Ensures consistent field naming
 */
export const formatPaymentMethodsForStorage = (methods: PaymentMethod[]): any[] => {
  return methods.map(method => ({
    id: method.id,
    name: method.name,
    description: method.description,
    icon: method.icon,
    fees: method.fees,
    processingTime: method.processingTime
  }));
};
