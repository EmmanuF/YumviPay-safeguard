
import { PaymentMethod } from '../../types/country';
import { Json } from '@/integrations/supabase/types';

/**
 * Safely parses payment methods from JSON data
 */
export const parsePaymentMethods = (paymentMethodsJson: Json | null): PaymentMethod[] => {
  if (!paymentMethodsJson) return [];
  
  try {
    // If it's already an array, we need to ensure each item has the required properties
    if (Array.isArray(paymentMethodsJson)) {
      // Validate that each item in the array has the required properties of PaymentMethod
      return paymentMethodsJson
        .filter(item => 
          typeof item === 'object' && 
          item !== null &&
          'id' in item && 
          'name' in item && 
          'description' in item && 
          'icon' in item && 
          'fees' in item && 
          'processingTime' in item
        )
        .map(item => {
          // Cast the item to any to safely access properties
          const typedItem = item as any;
          return {
            id: String(typedItem.id),
            name: String(typedItem.name),
            description: String(typedItem.description),
            icon: String(typedItem.icon),
            fees: String(typedItem.fees),
            processingTime: String(typedItem.processingTime)
          };
        });
    }
    
    // If it's not an array but a string, try to parse it
    if (typeof paymentMethodsJson === 'string') {
      try {
        const parsed = JSON.parse(paymentMethodsJson);
        if (Array.isArray(parsed)) {
          return parsePaymentMethods(parsed);
        }
      } catch (e) {
        console.error('Failed to parse payment methods string:', e);
      }
    }
    
    return [];
  } catch (e) {
    console.error('Error parsing payment methods:', e);
    return [];
  }
};

/**
 * Safely parses a single payment method from JSON data
 */
export const parsePaymentMethod = (methodJson: Json | null): PaymentMethod | null => {
  if (!methodJson || typeof methodJson !== 'object') return null;
  
  try {
    // Check if object has required properties
    if (
      methodJson !== null &&
      'id' in methodJson && 
      'name' in methodJson && 
      'description' in methodJson && 
      'icon' in methodJson && 
      'fees' in methodJson && 
      'processingTime' in methodJson
    ) {
      // Cast to any to safely access properties
      const typedMethod = methodJson as any;
      return {
        id: String(typedMethod.id),
        name: String(typedMethod.name),
        description: String(typedMethod.description),
        icon: String(typedMethod.icon),
        fees: String(typedMethod.fees),
        processingTime: String(typedMethod.processingTime)
      };
    }
    return null;
  } catch (e) {
    console.error('Error parsing payment method:', e);
    return null;
  }
};
