
import { Country } from '../../../../types/country';
import { coastalWestAfricanCountries } from './coastalWestAfrica';
import { sahelianWestAfricanCountries } from './sahelianWestAfrica';
import { maNoWestAfricanCountries } from './maNoWestAfrica';

// Debug imported countries
console.log('🔍 WEST AFRICA: Before mapping - checking original data');
console.log('🔍 WEST AFRICA: Coastal countries sending status:');
coastalWestAfricanCountries.forEach(c => {
  console.log(`🔍 WEST AFRICA: ${c.name}: isSendingEnabled=${c.isSendingEnabled}`);
});

console.log('🔍 WEST AFRICA: Sahelian countries sending status:');
sahelianWestAfricanCountries.forEach(c => {
  console.log(`🔍 WEST AFRICA: ${c.name}: isSendingEnabled=${c.isSendingEnabled}`);
});

console.log('🔍 WEST AFRICA: MaNo countries sending status:');
maNoWestAfricanCountries.forEach(c => {
  console.log(`🔍 WEST AFRICA: ${c.name}: isSendingEnabled=${c.isSendingEnabled}`);
});

// Combine all West African sub-regions
export const westAfricanCountries: Country[] = [
  ...coastalWestAfricanCountries.map(country => {
    const result = {
      ...country,
      isSendingEnabled: false,
      isReceivingEnabled: true
    };
    console.log(`🔍 WEST AFRICA MAPPED: ${country.name}: isSendingEnabled=${result.isSendingEnabled}`);
    return result;
  }),
  ...sahelianWestAfricanCountries.map(country => {
    const result = {
      ...country,
      isSendingEnabled: false,
      isReceivingEnabled: true
    };
    console.log(`🔍 WEST AFRICA MAPPED: ${country.name}: isSendingEnabled=${result.isSendingEnabled}`);
    return result;
  }),
  ...maNoWestAfricanCountries.map(country => {
    const result = {
      ...country,
      isSendingEnabled: false,
      isReceivingEnabled: true
    };
    console.log(`🔍 WEST AFRICA MAPPED: ${country.name}: isSendingEnabled=${result.isSendingEnabled}`);
    return result;
  })
];

// Debug after mapping
console.log('🔍 WEST AFRICA: After mapping - final data');
westAfricanCountries.forEach(c => {
  console.log(`🔍 WEST AFRICA FINAL: ${c.name}: isSendingEnabled=${c.isSendingEnabled}, isReceivingEnabled=${c.isReceivingEnabled}`);
});
