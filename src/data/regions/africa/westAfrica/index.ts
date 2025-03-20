
import { Country } from '../../../../types/country';
import { coastalWestAfricanCountries } from './coastalWestAfrica';
import { sahelianWestAfricanCountries } from './sahelianWestAfrica';
import { maNoWestAfricanCountries } from './maNoWestAfrica';

// Debug imported countries
console.log('DEBUG: West Africa - Before mapping:');
console.log('Coastal:', coastalWestAfricanCountries.map(c => c.name + (c.isSendingEnabled ? ' (sending)' : ' (not sending)')));
console.log('Sahelian:', sahelianWestAfricanCountries.map(c => c.name + (c.isSendingEnabled ? ' (sending)' : ' (not sending)')));
console.log('MaNo:', maNoWestAfricanCountries.map(c => c.name + (c.isSendingEnabled ? ' (sending)' : ' (not sending)')));

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

// Debug after mapping
console.log('DEBUG: West Africa - After mapping:');
westAfricanCountries.forEach(c => {
  console.log(`${c.name}: isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
});
