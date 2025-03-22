
import { Country } from '../../types/country';
import { countries as mockCountries } from '../../data/countries';
import { fetchSendingCountriesFromApi, fetchReceivingCountriesFromApi } from './countriesApi';

/**
 * Get a country by its code from the countries array with fallback
 */
export const getCountryByCode = (countries: Country[], code: string): Country | undefined => {
  if (!code) {
    console.error('getCountryByCode called with empty code');
    return undefined;
  }
  
  const country = countries.find(country => country.code === code);
  if (!country && code === 'CM') {
    // Special handling for Cameroon which is our default country
    const cameroon = mockCountries.find(c => c.code === 'CM');
    if (cameroon) {
      return {
        ...cameroon,
        flagUrl: cameroon.flagUrl || 'https://flagcdn.com/w80/cm.png'
      };
    }
  }
  return country;
};

/**
 * Get sending countries with fallbacks at each level
 */
export const getSendingCountries = async (
  countries: Country[], 
  isOffline: boolean
): Promise<Country[]> => {
  // If we already have countries data, filter it locally
  if (countries.length > 0) {
    const sendingCountries = countries.filter(country => country.isSendingEnabled);
    console.log(`Retrieved ${sendingCountries.length} sending countries from local data`);
    return sendingCountries;
  }
  
  if (!isOffline) {
    const apiData = await fetchSendingCountriesFromApi();
    if (apiData) {
      console.log(`Retrieved ${apiData.length} sending countries from API`);
      return apiData;
    }
  }
  
  const mockSendingCountries = mockCountries.filter(country => country.isSendingEnabled);
  console.log(`Retrieved ${mockSendingCountries.length} sending countries from mock data`);
  
  // If no sending countries in mock data, make the US a sending country
  if (mockSendingCountries.length === 0) {
    const usa = {
      name: 'United States',
      code: 'US',
      flagUrl: 'https://flagcdn.com/w80/us.png',
      currency: 'USD',
      isSendingEnabled: true,
      isReceivingEnabled: false,
      paymentMethods: []
    };
    console.log('No sending countries in mock data, adding USA');
    return [usa];
  }
  
  return mockSendingCountries;
};

/**
 * Get receiving countries with fallbacks
 */
export const getReceivingCountries = async (
  countries: Country[], 
  isOffline: boolean
): Promise<Country[]> => {
  // If we already have countries data, filter it locally
  if (countries.length > 0) {
    return countries.filter(country => country.isReceivingEnabled);
  }
  
  if (!isOffline) {
    const apiData = await fetchReceivingCountriesFromApi();
    if (apiData) {
      return apiData;
    }
  }
  
  return mockCountries.filter(country => country.isReceivingEnabled);
};
