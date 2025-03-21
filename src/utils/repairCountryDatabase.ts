
import { supabase } from '@/integrations/supabase/client';
import { 
  SENDING_COUNTRIES, 
  AFRICAN_COUNTRY_CODES, 
  ALWAYS_RECEIVING_COUNTRIES 
} from './countryRules';
import { toast } from 'sonner';

/**
 * Comprehensive utility to repair country database entries
 * Ensures all country flags are correctly set according to our business rules
 */
export const repairCountryDatabase = async (): Promise<boolean> => {
  console.log('🔧 Starting country database repair...');
  
  try {
    // Step 1: Get all countries from database
    console.log('🔧 Fetching all countries from database...');
    const { data: countries, error } = await supabase
      .from('countries')
      .select('code, name, is_sending_enabled, is_receiving_enabled')
      .order('name');
      
    if (error) {
      console.error('Error fetching countries:', error);
      throw new Error('Failed to fetch countries from database');
    }
    
    if (!countries || countries.length === 0) {
      console.warn('No countries found in database to repair');
      return false;
    }
    
    console.log(`🔧 Found ${countries.length} countries in database`);
    
    // Log initial state for key countries
    logCountryStatus('BEFORE REPAIR', countries);
    
    // Step 2: Create batch of updates
    const updates = [];
    
    // Ensure all SENDING_COUNTRIES are properly flagged
    for (const country of countries) {
      let needsUpdate = false;
      const update: any = { code: country.code };
      
      // Set sending flags according to rules
      if (SENDING_COUNTRIES.includes(country.code) && !country.is_sending_enabled) {
        update.is_sending_enabled = true;
        needsUpdate = true;
        console.log(`🔧 Setting ${country.name} (${country.code}) as a sending country`);
      }
      
      // Ensure African countries are NEVER sending countries
      if (AFRICAN_COUNTRY_CODES.includes(country.code) && country.is_sending_enabled) {
        update.is_sending_enabled = false;
        needsUpdate = true;
        console.log(`🔧 Ensuring ${country.name} (${country.code}) is NOT a sending country`);
      }
      
      // Ensure receiving countries are properly flagged
      if (ALWAYS_RECEIVING_COUNTRIES.includes(country.code) && !country.is_receiving_enabled) {
        update.is_receiving_enabled = true;
        needsUpdate = true;
        console.log(`🔧 Setting ${country.name} (${country.code}) as a receiving country`);
      }
      
      if (needsUpdate) {
        updates.push(update);
      }
    }
    
    // Step 3: Apply updates in batch if needed
    if (updates.length === 0) {
      console.log('🔧 No country updates needed - database is consistent with rules');
      return true;
    }
    
    console.log(`🔧 Applying ${updates.length} country updates to database`);
    
    // Execute upsert with all updates
    const { error: updateError } = await supabase
      .from('countries')
      .upsert(updates, { onConflict: 'code' });
      
    if (updateError) {
      console.error('Error updating countries:', updateError);
      throw new Error('Failed to update countries');
    }
    
    // Step 4: Verify updates
    console.log('🔧 Verifying country updates...');
    const { data: updatedCountries, error: verifyError } = await supabase
      .from('countries')
      .select('code, name, is_sending_enabled, is_receiving_enabled')
      .order('name');
      
    if (verifyError) {
      console.error('Error verifying country updates:', verifyError);
      throw new Error('Failed to verify country updates');
    }
    
    // Log final state for key countries
    logCountryStatus('AFTER REPAIR', updatedCountries || []);
    
    // Count sending and receiving countries
    const sendingCount = (updatedCountries || []).filter(c => c.is_sending_enabled).length;
    const receivingCount = (updatedCountries || []).filter(c => c.is_receiving_enabled).length;
    
    console.log(`🔧 Repair completed. Database now has ${sendingCount} sending countries and ${receivingCount} receiving countries`);
    
    // IMPORTANT: Force clear countries cache to ensure fresh data
    try {
      console.log('🔧 Forcibly clearing countries cache to ensure fresh data');
      localStorage.removeItem('yumvi_countries_cache');
      
      // Also try to import and call the cache clear function if possible
      const { clearCountriesCache } = await import('@/hooks/countries/countriesCache');
      clearCountriesCache();
      console.log('🔧 Countries cache cleared to ensure fresh data');
    } catch (e) {
      console.error('Failed to clear countries cache:', e);
    }
    
    return true;
  } catch (error) {
    console.error('Country database repair failed:', error);
    toast.error('Failed to repair country database');
    return false;
  }
};

/**
 * Helper function to log the status of key countries for debugging
 */
function logCountryStatus(label: string, countries: any[]) {
  // Key countries to check (both sending and receiving)
  const keySendingCodes = ['US', 'CA', 'GB', 'FR'];
  const keyReceivingCodes = ['CM', 'GH', 'NG', 'SN'];
  
  console.log(`🔧 ${label}: Key sending countries status:`);
  countries
    .filter(c => keySendingCodes.includes(c.code))
    .forEach(c => {
      console.log(`🔧 ${label}: ${c.name} (${c.code}): sending=${c.is_sending_enabled}, receiving=${c.is_receiving_enabled}`);
    });
    
  console.log(`🔧 ${label}: Key receiving countries status:`);
  countries
    .filter(c => keyReceivingCodes.includes(c.code))
    .forEach(c => {
      console.log(`🔧 ${label}: ${c.name} (${c.code}): sending=${c.is_sending_enabled}, receiving=${c.is_receiving_enabled}`);
    });
}

/**
 * Function to ensure the database has proper country data
 * This will set all sending and receiving flags according to our business rules
 */
export const ensureCountryFlags = async (): Promise<void> => {
  try {
    toast.info('Repairing country flags...');
    const success = await repairCountryDatabase();
    
    if (success) {
      // IMPORTANT: Force a page reload to clear any cached data
      toast.success('Country flags repaired successfully. Reloading app to apply changes...');
      
      // Give time for the toast to be seen before reload
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      toast.error('Failed to repair country flags');
    }
  } catch (error) {
    console.error('Error ensuring country flags:', error);
    toast.error('Failed to repair country flags');
  }
};
