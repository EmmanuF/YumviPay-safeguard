
import { Country } from '../types/country';
import { africanCountries } from './regions/africa';
import { europeanCountries } from './regions/europe';
import { northAmericanCountries } from './regions/northAmerica';
import { asiaPacificCountries } from './regions/asiaPacific';
import { middleEastCountries } from './regions/middleEast';

// Log the counts of countries for debugging
console.log('🔍 MAIN COUNTRIES: Loading all regions');
console.log('🔍 MAIN COUNTRIES: African countries:', africanCountries.length);
console.log('🔍 MAIN COUNTRIES: European countries:', europeanCountries.length);
console.log('🔍 MAIN COUNTRIES: North American countries:', northAmericanCountries.length);
console.log('🔍 MAIN COUNTRIES: Asia Pacific countries:', asiaPacificCountries.length);
console.log('🔍 MAIN COUNTRIES: Middle East countries:', middleEastCountries.length);

// Debug African countries sending status before combining
console.log('🔍 MAIN COUNTRIES: African countries before final combination:');
africanCountries.forEach(c => {
  console.log(`🔍 MAIN AFRICA: ${c.name}: isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
});

// Combine all regional country lists
export const countries: Country[] = [
  ...africanCountries,
  ...europeanCountries,
  ...northAmericanCountries,
  ...asiaPacificCountries,
  ...middleEastCountries,
];

// Debug key African countries to ensure they maintain correct flags
const keyCodes = ['CM', 'GH', 'NG', 'SN'];
console.log('🔍 MAIN COUNTRIES: Key African countries AFTER final combination:');
countries
  .filter(c => keyCodes.includes(c.code))
  .forEach(c => {
    console.log(`🔍 MAIN FINAL: ${c.name} (${c.code}): isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
  });

// For debugging purposes, log sending and receiving countries 
const sendingCountries = countries.filter(c => c.isSendingEnabled);
const receivingCountries = countries.filter(c => c.isReceivingEnabled);

console.log('🔍 MAIN COUNTRIES: Total countries:', countries.length);
console.log('🔍 MAIN COUNTRIES: Sending countries:', sendingCountries.length);
console.log('🔍 MAIN COUNTRIES: Sending country names:', sendingCountries.map(c => c.name).join(', '));
console.log('🔍 MAIN COUNTRIES: Receiving countries:', receivingCountries.length);
