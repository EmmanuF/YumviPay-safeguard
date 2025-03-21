
import { Country } from '@/types/country';
import { AFRICAN_COUNTRY_CODES, SENDING_COUNTRIES } from '@/utils/countries/countryRules';

export function logCountryDiagnostics(countries: Country[], context: string) {
  console.log(`🔍 DIAGNOSTICS (${context}): Analyzing ${countries.length} countries`);

  // Verify African countries
  const africanCountries = countries.filter(c => AFRICAN_COUNTRY_CODES.includes(c.code));
  console.log(`🔍 African countries (${africanCountries.length}):`);
  africanCountries.forEach(c => {
    console.log(`  - ${c.name} (${c.code}): sending=${c.isSendingEnabled}, receiving=${c.isReceivingEnabled}`);
  });

  // Verify sending countries
  const sendingCountries = countries.filter(c => SENDING_COUNTRIES.includes(c.code));
  console.log(`🔍 Sending countries (${sendingCountries.length}):`);
  sendingCountries.forEach(c => {
    console.log(`  - ${c.name} (${c.code}): sending=${c.isSendingEnabled}, receiving=${c.isReceivingEnabled}`);
  });
}
