
import { PaymentMethod } from "@/types/country";

/**
 * Parses payment methods from Supabase data into PaymentMethod objects
 */
export const parsePaymentMethods = (methods: any): PaymentMethod[] => {
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
  
  // If methods is not an array, return empty array
  if (!Array.isArray(methods)) {
    return [];
  }
  
  // Map to ensure all fields exist
  return methods.map(method => ({
    id: method.id || '',
    name: method.name || '',
    description: method.description || '',
    icon: method.icon || 'credit-card',
    fees: method.fees || '',
    processingTime: method.processingTime || ''
  }));
};

/**
 * Transforms payment methods object into a format compatible with Supabase
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
