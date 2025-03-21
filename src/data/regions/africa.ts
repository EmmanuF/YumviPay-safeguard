
import { Country } from '../../types/country';
import { westAfricanCountries } from './africa/westAfrica';
import { centralAfricanCountries } from './africa/centralAfrica';
import { eastAfricanCountries } from './africa/eastAfrica';
import { southernAfricanCountries } from './africa/southernAfrica';
import { northAfricanCountries } from './africa/northAfrica';

// Combine all African regional country lists
export const africanCountries: Country[] = [
  ...westAfricanCountries,
  ...centralAfricanCountries,
  ...eastAfricanCountries,
  ...southernAfricanCountries,
  ...northAfricanCountries
];
