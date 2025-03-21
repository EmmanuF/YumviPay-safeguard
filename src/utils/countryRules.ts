
/**
 * Centralized country rules enforcement utility
 * This is the SINGLE source of truth for country sending/receiving rules
 */

// List of African country codes that should NEVER be sending countries
export const AFRICAN_COUNTRY_CODES = [
  'CM', 'GH', 'NG', 'SN', 'CI', 'BJ', 'TG', 'BF', 'ML', 'NE', 
  'GW', 'GN', 'SL', 'LR', 'CD', 'GA', 'TD', 'CF', 'CG', 'GQ'
];

// All African countries should always be receiving countries
export const ALWAYS_RECEIVING_COUNTRIES = [...AFRICAN_COUNTRY_CODES];

// List of countries that should ALWAYS be sending countries
export const SENDING_COUNTRIES = [
  // North America
  'US', 'CA', 'MX', 'PA',
  // Europe
  'GB', 'FR', 'DE', 'IT', 'ES',
  // Middle East
  'AE', 'SA', 'QA', 'KW',
  // Asia Pacific
  'AU', 'JP', 'SG'
];

/**
 * Generic type for any country object that has sending/receiving flags
 * This allows the function to work with both admin and frontend country types
 */
export interface CountryWithFlags {
  code: string;
  is_sending_enabled?: boolean;
  is_receiving_enabled?: boolean;
  isSendingEnabled?: boolean;
  isReceivingEnabled?: boolean;
  [key: string]: any; // Allow other properties
}

/**
 * Enforces country rules for sending and receiving capabilities
 * This is the SINGLE source of truth for country rule enforcement
 * 
 * @param country Any country object with sending/receiving flags
 * @returns The country with correctly enforced flags
 */
export function enforceCountryRules<T extends CountryWithFlags>(country: T): T {
  // Create a copy of the country to avoid mutating the original
  const result = { ...country };
  
  // Determine if we're working with camelCase or snake_case properties
  const hasCamelCase = 'isSendingEnabled' in country;
  const hasSnakeCase = 'is_sending_enabled' in country;
  
  // If country is African, force receiving-only
  if (AFRICAN_COUNTRY_CODES.includes(country.code)) {
    if (hasCamelCase) {
      result.isSendingEnabled = false;
      result.isReceivingEnabled = true;
    }
    if (hasSnakeCase) {
      result.is_sending_enabled = false;
      result.is_receiving_enabled = true;
    }
  }
  
  // If country is in explicit sending list, ensure it's marked as sending
  if (SENDING_COUNTRIES.includes(country.code)) {
    if (hasCamelCase) {
      result.isSendingEnabled = true;
    }
    if (hasSnakeCase) {
      result.is_sending_enabled = true;
    }
  }
  
  // Always ensure receiving countries are properly marked
  if (ALWAYS_RECEIVING_COUNTRIES.includes(country.code)) {
    if (hasCamelCase) {
      result.isReceivingEnabled = true;
    }
    if (hasSnakeCase) {
      result.is_receiving_enabled = true;
    }
  }
  
  return result;
}

/**
 * Enforces country rules for an array of countries
 * @param countries Array of country objects
 * @returns Array with correctly enforced flags
 */
export function enforceCountryRulesForArray<T extends CountryWithFlags>(countries: T[]): T[] {
  return countries.map(enforceCountryRules);
}

/**
 * Validates if a country can be a sending country
 * @param countryCode The country code to check
 * @returns true if the country can be a sending country
 */
export function canBeSendingCountry(countryCode: string): boolean {
  return !AFRICAN_COUNTRY_CODES.includes(countryCode);
}

/**
 * Logs the status of key countries for debugging
 * @param countries Array of countries to check
 * @param source Description of the source for logging
 */
export function logKeyCountriesStatus(
  countries: CountryWithFlags[], 
  source: string
): void {
  // Key countries to check
  const keyCodes = ['CM', 'US', 'GB', 'FR'];
  
  console.log(`🔍 ${source}: Key countries status:`);
  countries
    .filter(c => keyCodes.includes(c.code))
    .forEach(c => {
      const sending = c.isSendingEnabled !== undefined 
        ? c.isSendingEnabled 
        : c.is_sending_enabled;
      const receiving = c.isReceivingEnabled !== undefined 
        ? c.isReceivingEnabled 
        : c.is_receiving_enabled;
      
      console.log(`🔍 ${source}: ${c.code}: sending=${sending}, receiving=${receiving}`);
    });
    
  // Count sending vs receiving countries
  const sendingCount = countries.filter(c => 
    c.isSendingEnabled === true || c.is_sending_enabled === true
  ).length;
  
  const receivingCount = countries.filter(c => 
    c.isReceivingEnabled === true || c.is_receiving_enabled === true
  ).length;
  
  console.log(`🔍 ${source}: Total ${sendingCount} sending and ${receivingCount} receiving countries`);
}
