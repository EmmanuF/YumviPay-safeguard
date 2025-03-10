
import { useState, useEffect } from 'react';
import { Country, PaymentMethod } from '../types/country';
import { countries as mockCountries } from '../data/countries';
import { supabase } from "@/integrations/supabase/client";
import { useNetwork } from '@/contexts/NetworkContext';
import { Json } from '@/integrations/supabase/types';

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isOffline } = useNetwork();

  // Helper function to safely parse the payment methods JSON
  const parsePaymentMethods = (paymentMethodsJson: Json | null): PaymentMethod[] => {
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
          .map(item => ({
            id: String(item.id),
            name: String(item.name),
            description: String(item.description),
            icon: String(item.icon),
            fees: String(item.fees),
            processingTime: String(item.processingTime)
          }));
      }
      return [];
    } catch (e) {
      console.error('Error parsing payment methods:', e);
      return [];
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        
        if (!isOffline) {
          // Try to fetch from Supabase if online
          try {
            const { data, error } = await supabase
              .from('countries')
              .select('*')
              .order('name');
              
            if (error) throw error;
            
            if (data && data.length > 0) {
              const formattedCountries: Country[] = data.map(country => ({
                name: country.name,
                code: country.code,
                currency: country.currency,
                flagUrl: `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`,
                isSendingEnabled: country.is_sending_enabled,
                isReceivingEnabled: country.is_receiving_enabled,
                paymentMethods: parsePaymentMethods(country.payment_methods)
              }));
              
              setCountries(formattedCountries);
              setIsLoading(false);
              return;
            }
          } catch (apiError) {
            console.error('Error fetching countries from Supabase:', apiError);
            // Fall back to mock data on API error
          }
        }
        
        // Use mock data if offline or API error
        console.log('Using mock country data due to offline status or API error');
        setCountries(mockCountries);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch countries'));
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, [isOffline]);

  const getCountryByCode = (code: string) => {
    return countries.find(country => country.code === code);
  };

  const getSendingCountries = async () => {
    if (!isOffline) {
      try {
        const { data, error } = await supabase
          .from('countries')
          .select('*')
          .eq('is_sending_enabled', true)
          .order('name');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          return data.map(country => ({
            name: country.name,
            code: country.code,
            currency: country.currency,
            flagUrl: `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`,
            isSendingEnabled: country.is_sending_enabled,
            isReceivingEnabled: country.is_receiving_enabled,
            paymentMethods: parsePaymentMethods(country.payment_methods)
          }));
        }
      } catch (error) {
        console.error('Error fetching sending countries from Supabase:', error);
        // Fall back to filtering local data
      }
    }
    
    return countries.filter(country => country.isSendingEnabled);
  };

  const getReceivingCountries = async () => {
    if (!isOffline) {
      try {
        const { data, error } = await supabase
          .from('countries')
          .select('*')
          .eq('is_receiving_enabled', true)
          .order('name');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          return data.map(country => ({
            name: country.name,
            code: country.code,
            currency: country.currency,
            flagUrl: `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`,
            isSendingEnabled: country.is_sending_enabled,
            isReceivingEnabled: country.is_receiving_enabled,
            paymentMethods: parsePaymentMethods(country.payment_methods)
          }));
        }
      } catch (error) {
        console.error('Error fetching receiving countries from Supabase:', error);
        // Fall back to filtering local data
      }
    }
    
    return countries.filter(country => country.isReceivingEnabled);
  };

  return {
    countries,
    isLoading,
    error,
    getCountryByCode,
    getSendingCountries,
    getReceivingCountries,
  };
}

// Re-export the types for easier imports
export type { Country, PaymentMethod } from '../types/country';
