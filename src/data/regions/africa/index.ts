
import { Country } from '../../../types/country';
import { northAfricanCountries } from './northAfrica';
import { eastAfricanCountries } from './eastAfrica';
import { southernAfricanCountries } from './southernAfrica';
import { centralAfricanCountries } from './centralAfrica';
import { westAfricanCountries } from './westAfrica';

// Combine all African sub-regions
export const africanCountries: Country[] = [
  ...northAfricanCountries,
  ...eastAfricanCountries,
  ...southernAfricanCountries,
  ...centralAfricanCountries,
  ...westAfricanCountries,
];
