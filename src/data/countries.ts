
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

// Combine all regional country lists
export const countries: Country[] = [
  ...africanCountries,
  ...europeanCountries,
  ...northAmericanCountries,
  ...asiaPacificCountries,
  ...middleEastCountries,
];

// For debugging purposes, log how many countries can send and receive
console.log('Total countries:', countries.length);
console.log('Sending countries:', countries.filter(c => c.isSendingEnabled).length);
console.log('Receiving countries:', countries.filter(c => c.isReceivingEnabled).length);
