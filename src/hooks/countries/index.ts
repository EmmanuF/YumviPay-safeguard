
import { useState, useEffect, useMemo } from 'react';
import { Country } from '../../types/country';
import { useNetwork } from '@/contexts/NetworkContext';
import { clearCountriesCache } from './countriesCache';
import { loadCountriesData } from './loadCountriesData';
import { getCountryByCode, getSendingCountries, getReceivingCountries } from './countrySelectors';

/**
 * Custom hook for managing countries data
 */
export function useCountries() {
  console.log("🔄 useCountries hook initializing");
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [forceRefresh, setForceRefresh] = useState(0);
  const { isOffline } = useNetwork();

  // Debug log countries
  useEffect(() => {
    console.log(`📊 Countries loaded: ${countries.length}`);
    if (countries.length > 0) {
      console.log('📋 Sample country data:', countries[0]);
      
      // Check sending countries specifically
      const sendingCountries = countries.filter(c => c.isSendingEnabled);
      console.log(`📤 Sending countries: ${sendingCountries.length}`);
      if (sendingCountries.length > 0) {
        console.log('📤 Sample sending country:', sendingCountries[0]);
        console.log('📤 All sending countries:', sendingCountries.map(c => c.name));
      } else {
        console.log('⚠️ No sending countries found!');
      }
      
      // DEBUG: Log Cameroon data specifically to check payment method IDs
      const cameroon = countries.find(c => c.code === 'CM');
      if (cameroon) {
        console.log('🇨🇲 DEBUG - Cameroon country data:', cameroon);
        console.log('🇨🇲 DEBUG - Cameroon payment methods:', cameroon.paymentMethods);
        if (cameroon.paymentMethods && cameroon.paymentMethods.length > 0) {
          cameroon.paymentMethods.forEach(method => {
            console.log(`🇨🇲 DEBUG - Payment method ID format: "${method.id}" (${typeof method.id})`);
          });
        }
      } else {
        console.log('🇨🇲 DEBUG - Cameroon data not found in countries list');
      }
    }
  }, [countries]);

  // Refresh countries data
  const refreshCountriesData = () => {
    console.log("🔄 Manually refreshing countries data");
    clearCountriesCache();
    setForceRefresh(prev => prev + 1);
  };

  // Load countries data
  useEffect(() => {
    loadCountriesData(isOffline, setCountries, setIsLoading, setError);
  }, [isOffline, forceRefresh]);

  // Create memoized accessor functions
  const countryByCodeSelector = useMemo(() => 
    (code: string): Country | undefined => getCountryByCode(countries, code),
    [countries]
  );

  const sendingCountriesSelector = useMemo(() => 
    async () => getSendingCountries(countries, isOffline),
    [countries, isOffline]
  );

  const receivingCountriesSelector = useMemo(() => 
    async () => getReceivingCountries(countries, isOffline),
    [countries, isOffline]
  );

  return {
    countries,
    isLoading,
    error,
    getCountryByCode: countryByCodeSelector,
    getSendingCountries: sendingCountriesSelector,
    getReceivingCountries: receivingCountriesSelector,
    refreshCountriesData,
  };
}

// Re-export the types for easier imports
export type { Country, PaymentMethod } from '../../types/country';
