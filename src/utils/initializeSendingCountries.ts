
import { supabase } from '@/integrations/supabase/client';
import { SENDING_COUNTRIES } from '@/utils/countries/countryRules';

/**
 * Ensures that all designated sending countries are properly set in the database
 * This function adds missing countries to the database and corrects their is_sending_enabled flag
 */
export const initializeSendingCountries = async (): Promise<void> => {
  console.log('Initializing sending countries...');
  
  try {
    // Check each country in our SENDING_COUNTRIES array
    for (const countryCode of SENDING_COUNTRIES) {
      // Check if country exists in database
      const { data: existingCountry, error: fetchError } = await supabase
        .from('countries')
        .select('*')
        .eq('code', countryCode)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = not found
        console.error(`Error checking country ${countryCode}:`, fetchError);
        continue;
      }
      
      if (existingCountry) {
        // Country exists, ensure it's marked as sending
        if (!existingCountry.is_sending_enabled) {
          console.log(`Updating ${countryCode} to be a sending country`);
          
          const { error: updateError } = await supabase
            .from('countries')
            .update({ is_sending_enabled: true })
            .eq('code', countryCode);
            
          if (updateError) {
            console.error(`Failed to update ${countryCode}:`, updateError);
          }
        } else {
          console.log(`${countryCode} is already correctly set as a sending country`);
        }
      } else {
        // Country doesn't exist, add it
        console.log(`Adding ${countryCode} as a new sending country`);
        
        // Create default values for the new country
        const countryName = getCountryName(countryCode);
        const currencyInfo = getDefaultCurrency(countryCode);
        
        const { error: insertError } = await supabase
          .from('countries')
          .insert({
            code: countryCode,
            name: countryName,
            currency: currencyInfo.currency,
            currency_symbol: currencyInfo.symbol,
            flag_emoji: getCountryFlag(countryCode),
            is_sending_enabled: true,
            is_receiving_enabled: false,
            payment_methods: []
          });
          
        if (insertError) {
          console.error(`Failed to add ${countryCode}:`, insertError);
        }
      }
    }
    
    console.log('Sending countries initialization complete');
  } catch (error) {
    console.error('Error initializing sending countries:', error);
  }
};

// Helper functions for country data
function getCountryName(code: string): string {
  const countryNames: Record<string, string> = {
    'US': 'United States',
    'CA': 'Canada',
    'MX': 'Mexico',
    'PA': 'Panama',
    'GB': 'United Kingdom',
    'FR': 'France',
    'DE': 'Germany',
    'IT': 'Italy',
    'ES': 'Spain',
    'AE': 'United Arab Emirates',
    'SA': 'Saudi Arabia',
    'QA': 'Qatar',
    'KW': 'Kuwait',
    'AU': 'Australia',
    'JP': 'Japan',
    'SG': 'Singapore'
  };
  
  return countryNames[code] || `Country ${code}`;
}

function getDefaultCurrency(code: string): { currency: string, symbol: string } {
  const currencyMap: Record<string, { currency: string, symbol: string }> = {
    'US': { currency: 'USD', symbol: '$' },
    'CA': { currency: 'CAD', symbol: 'C$' },
    'MX': { currency: 'MXN', symbol: '$' },
    'PA': { currency: 'PAB', symbol: 'B/.' },
    'GB': { currency: 'GBP', symbol: '£' },
    'FR': { currency: 'EUR', symbol: '€' },
    'DE': { currency: 'EUR', symbol: '€' },
    'IT': { currency: 'EUR', symbol: '€' },
    'ES': { currency: 'EUR', symbol: '€' },
    'AE': { currency: 'AED', symbol: 'د.إ' },
    'SA': { currency: 'SAR', symbol: '﷼' },
    'QA': { currency: 'QAR', symbol: '﷼' },
    'KW': { currency: 'KWD', symbol: 'د.ك' },
    'AU': { currency: 'AUD', symbol: 'A$' },
    'JP': { currency: 'JPY', symbol: '¥' },
    'SG': { currency: 'SGD', symbol: 'S$' }
  };
  
  return currencyMap[code] || { currency: 'USD', symbol: '$' };
}

function getCountryFlag(code: string): string {
  // Convert country code to flag emoji (simple algorithm)
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
}
