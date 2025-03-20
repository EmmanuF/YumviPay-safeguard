
import { AdminCountry } from "./types";

// Helper function to parse country data and handle payment methods
export const parseCountryData = (data: any[]): AdminCountry[] => {
  return data.map(country => {
    let parsedMethods = [];
    try {
      parsedMethods = Array.isArray(country.payment_methods) 
        ? country.payment_methods 
        : JSON.parse(country.payment_methods?.toString() || '[]');
    } catch (e) {
      console.error(`Error parsing payment methods for ${country.code}:`, e);
    }
    
    return {
      ...country,
      payment_methods: parsedMethods
    };
  });
};

// Default sending countries to add when initializing
export const DEFAULT_SENDING_COUNTRIES = [
  // North America
  { code: 'US', name: 'United States', currency: 'USD', currency_symbol: '$', flag_emoji: '🇺🇸', is_sending_enabled: true },
  { code: 'CA', name: 'Canada', currency: 'CAD', currency_symbol: 'C$', flag_emoji: '🇨🇦', is_sending_enabled: true },
  { code: 'MX', name: 'Mexico', currency: 'MXN', currency_symbol: '$', flag_emoji: '🇲🇽', is_sending_enabled: true },
  
  // Europe
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', currency_symbol: '£', flag_emoji: '🇬🇧', is_sending_enabled: true },
  { code: 'FR', name: 'France', currency: 'EUR', currency_symbol: '€', flag_emoji: '🇫🇷', is_sending_enabled: true },
  { code: 'DE', name: 'Germany', currency: 'EUR', currency_symbol: '€', flag_emoji: '🇩🇪', is_sending_enabled: true },
  
  // Middle East
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED', currency_symbol: 'د.إ', flag_emoji: '🇦🇪', is_sending_enabled: true },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', currency_symbol: '﷼', flag_emoji: '🇸🇦', is_sending_enabled: true },
  
  // Asia Pacific
  { code: 'AU', name: 'Australia', currency: 'AUD', currency_symbol: 'A$', flag_emoji: '🇦🇺', is_sending_enabled: true },
  { code: 'JP', name: 'Japan', currency: 'JPY', currency_symbol: '¥', flag_emoji: '🇯🇵', is_sending_enabled: true },
  { code: 'SG', name: 'Singapore', currency: 'SGD', currency_symbol: 'S$', flag_emoji: '🇸🇬', is_sending_enabled: true },
];

// Check if sending countries need to be initialized
export const checkAndInitializeSendingCountries = async (
  countries: AdminCountry[],
  addCountryFn: (country: Partial<AdminCountry>) => Promise<boolean>
): Promise<void> => {
  console.log('Checking if sending countries need to be initialized...');
  
  // If there are no sending-enabled countries, initialize defaults
  const sendingCountries = countries.filter(c => c.is_sending_enabled);
  if (sendingCountries.length === 0) {
    console.log('No sending countries found. Initializing default sending countries...');
    
    for (const country of DEFAULT_SENDING_COUNTRIES) {
      // Skip if country already exists but is not sending-enabled
      const existingCountry = countries.find(c => c.code === country.code);
      if (existingCountry) {
        console.log(`Country ${country.code} already exists. Updating to enable sending.`);
        // Update existing country
        const updated = await addCountryFn({
          ...existingCountry,
          is_sending_enabled: true
        });
        if (updated) {
          console.log(`Successfully enabled sending for ${country.code}`);
        } else {
          console.error(`Failed to enable sending for ${country.code}`);
        }
      } else {
        // Add new country
        console.log(`Adding default sending country: ${country.code}`);
        const added = await addCountryFn({
          ...country,
          payment_methods: []
        });
        if (added) {
          console.log(`Successfully added sending country ${country.code}`);
        } else {
          console.error(`Failed to add sending country ${country.code}`);
        }
      }
    }
    
    console.log('Default sending countries initialization complete.');
  } else {
    console.log(`Found ${sendingCountries.length} sending-enabled countries. No initialization needed.`);
  }
};
