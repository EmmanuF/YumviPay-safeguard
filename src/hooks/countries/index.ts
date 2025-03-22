
import { useState, useEffect } from 'react';
import { Country, PaymentMethod } from '../../types/country';
import { supabase } from '@/integrations/supabase/client';
import { countries as mockCountries } from '@/data/countries';
import { ensureSendingCountriesEnabled, processCountryData } from './enhanceCountriesData';

export type { Country, PaymentMethod };

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // First try to get countries from Supabase
        const { data, error } = await supabase
          .from('countries')
          .select('*');

        if (error) throw error;

        if (data && data.length > 0) {
          // Convert Supabase data to our Country type
          const formattedData: Country[] = data.map((country) => ({
            name: country.name,
            code: country.code,
            flagUrl: `https://flagcdn.com/${country.code.toLowerCase()}.svg`,
            currency: country.currency,
            isSendingEnabled: country.is_sending_enabled,
            isReceivingEnabled: country.is_receiving_enabled,
            paymentMethods: (country.payment_methods as PaymentMethod[]) || [],
            phonePrefix: country.phone_prefix
          }));

          // Enhance the data to ensure sending countries are properly set
          const enhancedData = ensureSendingCountriesEnabled(formattedData);
          setCountries(processCountryData(enhancedData));
        } else {
          // Fallback to mock data if no data in Supabase
          console.log('No countries found in database, using mock data');
          setCountries(processCountryData(mockCountries));
        }
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        
        // Fallback to mock data on error
        console.log('Using mock countries data due to error');
        const enhancedMockData = ensureSendingCountriesEnabled(mockCountries);
        setCountries(processCountryData(enhancedMockData));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Add a utility function to get a country by code
  const getCountryByCode = (code: string): Country | undefined => {
    return countries.find(country => country.code === code);
  };

  // Get sending countries only
  const getSendingCountries = (): Country[] => {
    return countries.filter(country => country.isSendingEnabled);
  };

  // Get receiving countries only
  const getReceivingCountries = (): Country[] => {
    return countries.filter(country => country.isReceivingEnabled);
  };

  return { 
    countries,
    isLoading,
    error,
    getCountryByCode,
    getSendingCountries,
    getReceivingCountries 
  };
};
