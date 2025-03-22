
import { useState, useEffect, useCallback } from 'react';
import { Country, PaymentMethod } from '../../types/country';
import { supabase } from '@/integrations/supabase/client';
import { countries as mockCountries } from '@/data/countries';
import { ensureSendingCountriesEnabled, processCountryData, ensureReceivingCountriesEnabled } from './enhanceCountriesData';
import { parsePaymentMethods } from './parseCountryData';
import { loadCountriesData } from './loadCountriesData';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';

export type { Country, PaymentMethod };

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isOffline } = useOfflineStatus();

  const fetchCountries = useCallback(async () => {
    try {
      setIsLoading(true);
      await loadCountriesData(isOffline, setCountries, setIsLoading, setError);
    } catch (err) {
      console.error('❌ Error in fetchCountries:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      
      // Fallback to mock data on error
      console.log('Using mock countries data due to error');
      const enhancedMockData = ensureSendingCountriesEnabled(mockCountries);
      const finalMockData = ensureReceivingCountriesEnabled(enhancedMockData);
      setCountries(processCountryData(finalMockData));
      setIsLoading(false);
    }
  }, [isOffline]);

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  // Function to refresh countries data
  const refreshCountriesData = () => {
    console.log("🔄 Manually refreshing countries data...");
    fetchCountries();
  };

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
    getReceivingCountries,
    refreshCountriesData 
  };
};

// Helper function to get default phone prefix for a country code
export const getDefaultPhonePrefix = (countryCode: string): string => {
  const prefixMap: {[key: string]: string} = {
    'US': '+1', 'CA': '+1', 'GB': '+44', 'CM': '+237', 'FR': '+33', 'DE': '+49',
    'IT': '+39', 'ES': '+34', 'NL': '+31', 'BE': '+32', 'CH': '+41', 'SE': '+46',
    'NO': '+47', 'AU': '+61', 'JP': '+81', 'SG': '+65', 'NZ': '+64', 'AE': '+971',
    'QA': '+974', 'SA': '+966', 'KE': '+254', 'ZA': '+27', 'NG': '+234', 'GH': '+233',
    'IE': '+353', 'DK': '+45', 'FI': '+358', 'PT': '+351', 'KR': '+82',
    'MY': '+60', 'HK': '+852', 'CR': '+506', 'PA': '+507'
  };
  
  return prefixMap[countryCode] || '+0';
};
