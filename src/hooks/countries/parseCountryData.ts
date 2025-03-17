
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
          typeof item === 'object' &&
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
    return [];
  } catch (e) {
    console.error('Error parsing payment methods:', e);
    return [];
  }
};
