
import { Country } from '@/types/country';
import { AdminCountry } from '@/services/admin/countries/types';
import { supabase } from '@/integrations/supabase/client';
import { AFRICAN_COUNTRY_CODES, SENDING_COUNTRIES } from './countryRules';

/**
 * Logs detailed diagnostic information about country data
 * Used for debugging country-related issues
 */
export const logCountryDiagnostics = (countries: Country[], source: string) => {
  if (!countries || countries.length === 0) {
    console.log(`[DIAGNOSTICS] ${source}: No countries found`);
    return;
  }
  
  console.log(`[DIAGNOSTICS] ${source}: ${countries.length} countries loaded`);
  
  // Count sending vs receiving
  const sendingCount = countries.filter(c => c.isSendingEnabled).length;
  const receivingCount = countries.filter(c => c.isReceivingEnabled).length;
  
  console.log(`[DIAGNOSTICS] ${source}: ${sendingCount} sending and ${receivingCount} receiving countries`);
  
  // Check for problematic countries
  const africanSending = countries.filter(c => 
    AFRICAN_COUNTRY_CODES.includes(c.code) && c.isSendingEnabled
  );
  
  const missingSending = SENDING_COUNTRIES.filter(code => 
    !countries.find(c => c.code === code)?.isSendingEnabled
  );
  
  if (africanSending.length > 0) {
    console.warn(`[DIAGNOSTICS] ${source}: Found ${africanSending.length} African countries incorrectly marked as sending`);
    africanSending.forEach(c => {
      console.warn(`[DIAGNOSTICS] ${source}: - ${c.name} (${c.code}) is incorrectly marked as sending`);
    });
  }
  
  if (missingSending.length > 0) {
    console.warn(`[DIAGNOSTICS] ${source}: Missing ${missingSending.length} countries that should be sending`);
    missingSending.forEach(code => {
      console.warn(`[DIAGNOSTICS] ${source}: - ${code} is missing or not marked as sending`);
    });
  }
  
  // Log currency information for sending countries
  const sendingCountries = countries.filter(c => c.isSendingEnabled);
  console.log(`[DIAGNOSTICS] ${source}: Sending countries with currencies:`);
  sendingCountries.forEach(c => {
    console.log(`[DIAGNOSTICS] ${source}: - ${c.name} (${c.code}): ${c.currency}`);
  });
  
  // Check for duplicate currencies
  const currencyCounts: Record<string, number> = {};
  const currencyCountries: Record<string, string[]> = {};
  
  countries.forEach(c => {
    if (!currencyCounts[c.currency]) {
      currencyCounts[c.currency] = 0;
      currencyCountries[c.currency] = [];
    }
    currencyCounts[c.currency]++;
    currencyCountries[c.currency].push(c.code);
  });
  
  const duplicateCurrencies = Object.keys(currencyCounts).filter(curr => currencyCounts[curr] > 1);
  if (duplicateCurrencies.length > 0) {
    console.log(`[DIAGNOSTICS] ${source}: Found ${duplicateCurrencies.length} currencies used by multiple countries`);
    duplicateCurrencies.forEach(curr => {
      console.log(`[DIAGNOSTICS] ${source}: - ${curr} is used by: ${currencyCountries[curr].join(', ')}`);
    });
  }
};

/**
 * Check the Supabase database for country data issues
 * This function can be called manually to diagnose database issues
 */
export const diagnoseSupabaseCountries = async () => {
  try {
    console.log('[DIAGNOSTICS] Running Supabase countries diagnostic...');
    
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('[DIAGNOSTICS] Error fetching countries:', error);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('[DIAGNOSTICS] No countries found in Supabase');
      return;
    }
    
    console.log(`[DIAGNOSTICS] Found ${data.length} countries in Supabase`);
    
    // Check for countries that should be sending but aren't
    const missingCountries = SENDING_COUNTRIES.filter(code => 
      !data.find(c => c.code === code)
    );
    
    if (missingCountries.length > 0) {
      console.warn(`[DIAGNOSTICS] Missing ${missingCountries.length} sending countries in database`);
      console.warn(`[DIAGNOSTICS] Missing countries: ${missingCountries.join(', ')}`);
    }
    
    // Check for incorrect flags
    const incorrectSending = data.filter(c => 
      (AFRICAN_COUNTRY_CODES.includes(c.code) && c.is_sending_enabled) ||
      (SENDING_COUNTRIES.includes(c.code) && !c.is_sending_enabled)
    );
    
    if (incorrectSending.length > 0) {
      console.warn(`[DIAGNOSTICS] Found ${incorrectSending.length} countries with incorrect sending flags`);
      incorrectSending.forEach(c => {
        if (AFRICAN_COUNTRY_CODES.includes(c.code) && c.is_sending_enabled) {
          console.warn(`[DIAGNOSTICS] - ${c.name} (${c.code}): African country incorrectly set as sending`);
        }
        if (SENDING_COUNTRIES.includes(c.code) && !c.is_sending_enabled) {
          console.warn(`[DIAGNOSTICS] - ${c.name} (${c.code}): Sending country incorrectly set as non-sending`);
        }
      });
    }
    
    // Log currencies for sending countries
    const sendingCountries = data.filter(c => c.is_sending_enabled);
    console.log(`[DIAGNOSTICS] ${sendingCountries.length} sending countries with currencies in database:`);
    sendingCountries.forEach(c => {
      console.log(`[DIAGNOSTICS] - ${c.name} (${c.code}): ${c.currency}`);
    });
    
  } catch (error) {
    console.error('[DIAGNOSTICS] Error running country diagnostics:', error);
  }
};
