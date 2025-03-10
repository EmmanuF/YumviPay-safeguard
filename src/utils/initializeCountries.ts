
import { supabase } from '@/integrations/supabase/client';
import { countries as mockCountries } from '@/data/countries';
import { Json } from '@/integrations/supabase/types';

// Function to initialize countries in Supabase
export const initializeCountries = async (): Promise<void> => {
  try {
    console.log('Checking if countries table needs initialization...');
    
    // Check if countries table is empty
    const { data, error } = await supabase
      .from('countries')
      .select('code')
      .limit(1);
      
    if (error) throw error;
    
    // If there's at least one country, we don't need to initialize
    if (data && data.length > 0) {
      console.log('Countries table already contains data, skipping initialization.');
      return;
    }
    
    console.log('Initializing countries table with default data...');
    
    // Insert countries into Supabase one by one to avoid type issues
    for (const country of mockCountries) {
      const { error: insertError } = await supabase
        .from('countries')
        .insert({
          code: country.code,
          name: country.name,
          currency: country.currency,
          currency_symbol: country.currency === 'USD' ? '$' : country.currency === 'XAF' ? 'FCFA' : '£',
          flag_emoji: country.code === 'CM' ? '🇨🇲' : country.code === 'NG' ? '🇳🇬' : '🇬🇭',
          is_sending_enabled: country.isSendingEnabled,
          is_receiving_enabled: country.isReceivingEnabled,
          payment_methods: country.paymentMethods as unknown as Json
        });
        
      if (insertError) {
        console.error(`Error inserting country ${country.code}:`, insertError);
      }
    }
    
    console.log('Countries initialized successfully!');
  } catch (error) {
    console.error('Error initializing countries:', error);
  }
};
