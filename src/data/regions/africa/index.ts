
import { Country } from '../../../types/country';
import { northAfricanCountries } from './northAfrica';
import { eastAfricanCountries } from './eastAfrica';
import { southernAfricanCountries } from './southernAfrica';
import { centralAfricanCountries } from './centralAfrica';
import { westAfricanCountries } from './westAfrica';

// Debug sub-regions before combining
console.log('DEBUG: Africa - Before combining:');
console.log('North Africa:', northAfricanCountries.length, 'countries');
console.log('East Africa:', eastAfricanCountries.length, 'countries');
console.log('Southern Africa:', southernAfricanCountries.length, 'countries');
console.log('Central Africa:', centralAfricanCountries.length, 'countries');
console.log('West Africa:', westAfricanCountries.length, 'countries');

// Check sending status of Central African countries
console.log('DEBUG: Central African countries sending status:');
centralAfricanCountries.forEach(c => {
  console.log(`${c.name}: isSendingEnabled=${c.isSendingEnabled}`);
});

// Combine all African sub-regions
export const africanCountries: Country[] = [
  ...northAfricanCountries,
  ...eastAfricanCountries,
  ...southernAfricanCountries,
  ...centralAfricanCountries,
  ...westAfricanCountries,
];

// Debug after combining
console.log('DEBUG: Africa - After combining, checking first few countries:');
africanCountries.slice(0, 5).forEach(c => {
  console.log(`${c.name}: isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
});
