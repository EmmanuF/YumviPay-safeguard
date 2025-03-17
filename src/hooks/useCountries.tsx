
import { useState, useEffect, useMemo } from 'react';
import { Country, PaymentMethod } from '../types/country';
import { countries as mockCountries } from '../data/countries';
import { supabase } from "@/integrations/supabase/client";
import { useNetwork } from '@/contexts/NetworkContext';
import { Json } from '@/integrations/supabase/types';

// Cache countries data in memory to avoid repeated fetches
let countriesCache: Country[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>(countriesCache || []);
  const [isLoading, setIsLoading] = useState(!countriesCache);
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

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // Return cached data if it exists and is still valid
        if (countriesCache && (Date.now() - cacheTimestamp) < CACHE_TTL) {
          console.log('Using cached countries data');
          setCountries(countriesCache);
          setIsLoading(false);
          return;
        }
        
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
              
              // Update cache
              countriesCache = formattedCountries;
              cacheTimestamp = Date.now();
              
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
        
        // Update cache
        countriesCache = mockCountries;
        cacheTimestamp = Date.now();
        
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch countries'));
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, [isOffline]);

  const getCountryByCode = useMemo(() => 
    (code: string) => countries.find(country => country.code === code),
    [countries]
  );

  const getSendingCountries = useMemo(() => 
    async () => {
      // If we already have countries data, filter it locally
      if (countries.length > 0) {
        return countries.filter(country => country.isSendingEnabled);
      }
      
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
        }
      }
      
      return mockCountries.filter(country => country.isSendingEnabled);
    },
    [countries, isOffline]
  );

  const getReceivingCountries = useMemo(() => 
    async () => {
      // If we already have countries data, filter it locally
      if (countries.length > 0) {
        return countries.filter(country => country.isReceivingEnabled);
      }
      
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
        }
      }
      
      return mockCountries.filter(country => country.isReceivingEnabled);
    },
    [countries, isOffline]
  );

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
