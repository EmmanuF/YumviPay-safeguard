
import { useEffect, useState } from 'react';
import { useCountries } from '@/hooks/useCountries';
import { clearCountriesCache } from '../countries/countriesCache';

/**
 * Hook responsible for initializing and managing currency lists
 */
export const useInitializeCountries = () => {
  const { countries, isLoading: countriesLoading, getSendingCountries, getReceivingCountries, refreshCountries } = useCountries();
  const [sendingCountryList, setSendingCountryList] = useState<string[]>([]);
  const [receivingCountryList, setReceivingCountryList] = useState<string[]>([]);
  
  // Clear the countries cache to ensure we get fresh data
  useEffect(() => {
    console.log('Initializing countries data, clearing cache to ensure fresh data');
    clearCountriesCache();
    refreshCountries();
  }, [refreshCountries]);

  // Load sending and receiving countries on component mount
  useEffect(() => {
    const loadCountryLists = async () => {
      console.log('Loading country lists in useInitializeCountries');
      
      try {
        // Fetch sending countries
        console.log('Fetching sending countries...');
        const sendingCountries = await getSendingCountries();
        console.log('Got sending countries:', sendingCountries.map(c => c.name).join(', '));
        
        const sendingCurrencies = Array.from(new Set(
          sendingCountries.map(country => country.currency)
        )).sort();
        
        console.log('Sending currencies retrieved:', sendingCurrencies);
        setSendingCountryList(sendingCurrencies);
        
        // Fetch receiving countries
        console.log('Fetching receiving countries...');
        const receivingCountries = await getReceivingCountries();
        console.log('Got receiving countries:', receivingCountries.map(c => c.name).join(', '));
        
        const receivingCurrencies = Array.from(new Set(
          receivingCountries.map(country => country.currency)
        )).sort();
        
        console.log('Receiving currencies retrieved:', receivingCurrencies);
        setReceivingCountryList(receivingCurrencies);
      } catch (error) {
        console.error('Error loading country lists:', error);
      }
    };
    
    // Only load country lists if countries data is available
    if (countries.length > 0) {
      loadCountryLists();
    } else {
      console.log('Countries data not yet available, waiting...');
    }
  }, [countries, getSendingCountries, getReceivingCountries]);

  return {
    sendingCountryList,
    receivingCountryList,
    countriesLoading
  };
};
