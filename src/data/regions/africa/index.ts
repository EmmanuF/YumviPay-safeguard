
import { Country } from '../../../types/country';
import { northAfricanCountries } from './northAfrica';
import { eastAfricanCountries } from './eastAfrica';
import { southernAfricanCountries } from './southernAfrica';
import { centralAfricanCountries } from './centralAfrica';
import { westAfricanCountries } from './westAfrica';

// Debug sub-regions before combining
console.log('🔍 AFRICA: Before combining - checking imported sub-regions');

// Check sending status of Central African countries
console.log('🔍 AFRICA: Central African countries sending status:');
centralAfricanCountries.forEach(c => {
  console.log(`🔍 AFRICA CENTRAL: ${c.name}: isSendingEnabled=${c.isSendingEnabled}`);
});

// Check West African countries
console.log('🔍 AFRICA: West African countries sending status:');
westAfricanCountries.forEach(c => {
  console.log(`🔍 AFRICA WEST: ${c.name}: isSendingEnabled=${c.isSendingEnabled}`);
});

// Combine all African sub-regions
export const africanCountries: Country[] = [
  ...northAfricanCountries,
  ...eastAfricanCountries,
  ...southernAfricanCountries,
  ...centralAfricanCountries,
  ...westAfricanCountries,
];

// Verify combined data
console.log('🔍 AFRICA: After combining - checking all African countries');
africanCountries.forEach(c => {
  console.log(`🔍 AFRICA COMBINED: ${c.name}: isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
});

// Specifically check key countries
const keyCodes = ['CM', 'GH', 'NG', 'SN'];
console.log('🔍 AFRICA: Key countries after combining:');
africanCountries
  .filter(c => keyCodes.includes(c.code))
  .forEach(c => {
    console.log(`🔍 AFRICA KEY: ${c.name} (${c.code}): isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
  });
