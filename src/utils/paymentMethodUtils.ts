
import { Json } from "@/integrations/supabase/types";
import { AdminPaymentMethod } from "@/services/admin/countries/types";

/**
 * Safely parses payment methods from Json type to PaymentMethod[]
 * Handles various formats and provides type safety
 */
export const parsePaymentMethods = (data: Json | null | undefined): AdminPaymentMethod[] => {
  if (!data) return [];
  
  try {
    // Handle array format
    if (Array.isArray(data)) {
      // Validate that each item in the array has the required properties of AdminPaymentMethod
      return data.filter(item => 
        typeof item === 'object' && 
        item !== null && 
        'id' in item && 
        'name' in item
      ) as AdminPaymentMethod[];
    }
    
    // Handle string format (JSON string)
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => 
            typeof item === 'object' && 
            item !== null && 
            'id' in item && 
            'name' in item
          ) as AdminPaymentMethod[];
        }
        return [];
      } catch {
        return [];
      }
    }
    
    // Handle object format
    if (typeof data === 'object') {
      // If it's an object with numeric keys, convert to array
      const values = Object.values(data);
      return values.filter(item => 
        typeof item === 'object' && 
        item !== null && 
        'id' in item && 
        'name' in item
      ) as AdminPaymentMethod[];
    }
    
    // Handle other formats
    console.error("Unexpected payment methods format:", data);
    return [];
  } catch (error) {
    console.error("Error parsing payment methods:", error);
    return [];
  }
};
