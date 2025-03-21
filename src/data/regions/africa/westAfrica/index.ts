
import { Country } from '../../../../types/country';
import { coastalWestAfricanCountries } from './coastalWestAfrica';
import { sahelianWestAfricanCountries } from './sahelianWestAfrica';
import { maNoWestAfricanCountries } from './maNoWestAfrica';

// Combine all West African sub-regions
export const westAfricanCountries: Country[] = [
  ...coastalWestAfricanCountries,
  ...sahelianWestAfricanCountries,
  ...maNoWestAfricanCountries,
];
