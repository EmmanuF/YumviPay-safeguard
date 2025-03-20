
import { Country } from '../types/country';
import { africanCountries } from './regions/africa';
import { europeanCountries } from './regions/europe';
import { northAmericanCountries } from './regions/northAmerica';
import { asiaPacificCountries } from './regions/asiaPacific';
import { middleEastCountries } from './regions/middleEast';

// Log the counts of countries for debugging
console.log('African countries:', africanCountries.length);
console.log('European countries:', europeanCountries.length);
console.log('North American countries:', northAmericanCountries.length);
console.log('Asia Pacific countries:', asiaPacificCountries.length);
console.log('Middle East countries:', middleEastCountries.length);

// Debug African countries sending status before combining
console.log('DEBUG: African countries sending status:');
africanCountries.forEach(c => {
  console.log(`${c.name}: isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
});

// Combine all regional country lists
export const countries: Country[] = [
  ...africanCountries,
  ...europeanCountries,
  ...northAmericanCountries,
  ...asiaPacificCountries,
  ...middleEastCountries,
];

// Debug final countries after combination
console.log('DEBUG: Final countries after combination (sample):');
countries.slice(0, 5).forEach(c => {
  console.log(`${c.name}: isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
});

// For debugging purposes, log how many countries can send and receive
console.log('Total countries:', countries.length);
console.log('Sending countries:', countries.filter(c => c.isSendingEnabled).length);
console.log('Receiving countries:', countries.filter(c => c.isReceivingEnabled).length);
