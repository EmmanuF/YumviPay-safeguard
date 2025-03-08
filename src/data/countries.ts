
import { Country } from '../types/country';
import { africanCountries } from './regions/africa';
import { europeanCountries } from './regions/europe';
import { northAmericanCountries } from './regions/northAmerica';
import { asiaPacificCountries } from './regions/asiaPacific';

// Combine all regional country lists
export const countries: Country[] = [
  ...africanCountries,
  ...europeanCountries,
  ...northAmericanCountries,
  ...asiaPacificCountries,
];
