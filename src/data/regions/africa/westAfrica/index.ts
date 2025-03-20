
import { Country } from '../../../../types/country';
import { coastalWestAfricanCountries } from './coastalWestAfrica';
import { sahelianWestAfricanCountries } from './sahelianWestAfrica';
import { maNoWestAfricanCountries } from './maNoWestAfrica';

// Combine all West African sub-regions
export const westAfricanCountries: Country[] = [
  ...coastalWestAfricanCountries.map(country => ({
    ...country,
    isSendingEnabled: false,
    isReceivingEnabled: true
  })),
  ...sahelianWestAfricanCountries.map(country => ({
    ...country,
    isSendingEnabled: false,
    isReceivingEnabled: true
  })),
  ...maNoWestAfricanCountries.map(country => ({
    ...country,
    isSendingEnabled: false,
    isReceivingEnabled: true
  }))
];
