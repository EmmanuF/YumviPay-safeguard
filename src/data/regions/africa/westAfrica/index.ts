
import { Country } from '../../../../types/country';
import { getWestAfricaBaseCountries } from './baseCountries';

// Get base data and ensure all West African countries have isSendingEnabled explicitly set to false
const baseCountries = getWestAfricaBaseCountries();

// Map all West African countries to ensure sending is disabled and receiving is enabled
export const westAfricanCountries: Country[] = baseCountries.map(country => ({
  ...country,
  isSendingEnabled: false, // West African countries should never be sending countries
  isReceivingEnabled: true
}));

// Add debug logging
console.log('🔍 WEST AFRICA: Final countries data - All should have isSendingEnabled=false');
westAfricanCountries.forEach(c => {
  console.log(`🔍 WEST AFRICA FINAL: ${c.name}: isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
});
