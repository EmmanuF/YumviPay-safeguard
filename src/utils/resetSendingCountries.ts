
import { supabase } from '@/integrations/supabase/client';
import { 
  SENDING_COUNTRIES, 
  AFRICAN_COUNTRY_CODES,
  logKeyCountriesStatus
} from '@/utils/countryRules';

/**
 * Reset all sending and receiving flags to their correct values
 * This can be used to fix incorrectly set countries
 */
export const resetCountryFlags = async (): Promise<void> => {
  try {
    console.log('Resetting country sending/receiving flags...');
    
    // Get all countries
    const { data: countries, error } = await supabase
      .from('countries')
      .select('code, name, is_sending_enabled, is_receiving_enabled');
      
    if (error) throw error;
    
    if (!countries || countries.length === 0) {
      console.log('No countries found to reset');
      return;
    }
    
    console.log(`Found ${countries.length} countries to check`);
    logKeyCountriesStatus(countries, 'RESET BEFORE');
    
    // Process each country
    for (const country of countries) {
      const isAfrican = AFRICAN_COUNTRY_CODES.includes(country.code);
      const isSendingCountry = SENDING_COUNTRIES.includes(country.code);
      
      let needsUpdate = false;
      let updates: Record<string, any> = {};
      
      // Check if african country is incorrectly set as sending
      if (isAfrican && country.is_sending_enabled) {
        console.log(`Fixing ${country.name} (${country.code}): African country incorrectly set as sending`);
        updates.is_sending_enabled = false;
        needsUpdate = true;
      }
      
      // Check if sending country is incorrectly set as non-sending
      if (isSendingCountry && !country.is_sending_enabled) {
        console.log(`Fixing ${country.name} (${country.code}): Sending country incorrectly set as non-sending`);
        updates.is_sending_enabled = true;
        needsUpdate = true;
      }
      
      // Check if African country is incorrectly set as non-receiving
      if (isAfrican && !country.is_receiving_enabled) {
        console.log(`Fixing ${country.name} (${country.code}): African country incorrectly set as non-receiving`);
        updates.is_receiving_enabled = true;
        needsUpdate = true;
      }
      
      // Update if needed
      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from('countries')
          .update(updates)
          .eq('code', country.code);
          
        if (updateError) {
          console.error(`Error updating ${country.name} (${country.code}):`, updateError);
        } else {
          console.log(`Successfully reset ${country.name} (${country.code})`);
        }
      }
    }
    
    // Get updated countries to verify changes
    const { data: updatedCountries } = await supabase
      .from('countries')
      .select('code, name, is_sending_enabled, is_receiving_enabled');
      
    if (updatedCountries && updatedCountries.length > 0) {
      logKeyCountriesStatus(updatedCountries, 'RESET AFTER');
    }
    
    console.log('Country reset completed');
  } catch (error) {
    console.error('Error resetting country flags:', error);
  }
};
