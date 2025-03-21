
import { supabase } from '@/integrations/supabase/client';
import { 
  SENDING_COUNTRIES, 
  AFRICAN_COUNTRY_CODES, 
  ALWAYS_RECEIVING_COUNTRIES 
} from './countryRules';
import { toast } from 'sonner';
import { clearCountriesCache } from '@/hooks/countries/countriesCache';

/**
 * Safely clears the countries cache
 */
const safelyClearCache = async (): Promise<void> => {
  try {
    console.log('🔧 Safely clearing countries cache to ensure fresh data');
    
    // First try direct localStorage access
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('yumvi_countries_cache');
    }
    
    // Then try the imported function
    clearCountriesCache();
    
    console.log('🔧 Countries cache cleared to ensure fresh data');
  } catch (e) {
    console.error('Failed to clear countries cache:', e);
  }
};

/**
 * Comprehensive utility to repair country database entries
 * Ensures all country flags are correctly set according to our business rules
 */
export const repairCountryDatabase = async (): Promise<boolean> => {
  console.log('🔧 Starting country database repair...');
  
  try {
    // First clear any cached data to ensure we're working with fresh data
    await safelyClearCache();
    
    // Step 1: Get all countries from database
    console.log('🔧 Fetching all countries from database...');
    const { data: countries, error } = await supabase
      .from('countries')
      .select('code, name, is_sending_enabled, is_receiving_enabled')
      .order('name');
      
    if (error) {
      console.error('Error fetching countries:', error);
      throw new Error(`Failed to fetch countries from database: ${error.message}`);
    }
    
    if (!countries || countries.length === 0) {
      console.warn('No countries found in database to repair');
      return false;
    }
    
    console.log(`🔧 Found ${countries.length} countries in database`);
    
    // Log initial state for key countries
    logCountryStatus('BEFORE REPAIR', countries);
    
    // Step 2: Create batch of updates with correct service role authentication
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
      } else if (!SENDING_COUNTRIES.includes(country.code) && country.is_sending_enabled) {
        // If not in sending countries list but is marked as sending, disable sending
        update.is_sending_enabled = false;
        needsUpdate = true;
        console.log(`🔧 Setting ${country.name} (${country.code}) as NOT a sending country`);
      }
      
      // Ensure African countries are NEVER sending countries (double-check)
      if (AFRICAN_COUNTRY_CODES.includes(country.code) && country.is_sending_enabled) {
        update.is_sending_enabled = false;
        needsUpdate = true;
        console.log(`🔧 Ensuring ${country.name} (${country.code}) is NOT a sending country (African country)`);
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
    
    // Process updates one by one to prevent RLS issues and provide better error handling
    let successCount = 0;
    for (const update of updates) {
      try {
        const { error: updateError } = await supabase
          .from('countries')
          .update({
            is_sending_enabled: update.is_sending_enabled,
            is_receiving_enabled: update.is_receiving_enabled
          })
          .eq('code', update.code);
          
        if (updateError) {
          console.error(`Error updating country ${update.code}:`, updateError);
        } else {
          successCount++;
        }
      } catch (err) {
        console.error(`Failed to update country ${update.code}:`, err);
      }
    }
    
    if (successCount === 0 && updates.length > 0) {
      throw new Error('Failed to update any countries due to permission issues');
    }
    
    console.log(`🔧 Successfully updated ${successCount}/${updates.length} countries`);
    
    // IMPORTANT: Force clear countries cache to ensure fresh data
    await safelyClearCache();
    
    return true;
  } catch (error) {
    console.error('Country database repair failed:', error);
    toast.error(`Failed to repair country database: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      toast.success('Country flags repaired successfully');
      
      // Give user the option to reload if they want
      toast.success('Reload the page to see updated country data', {
        action: {
          label: 'Reload Now',
          onClick: () => window.location.reload()
        },
        duration: 5000
      });
    } else {
      toast.error('Failed to repair country flags');
    }
  } catch (error) {
    console.error('Error ensuring country flags:', error);
    toast.error(`Failed to repair country flags: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
