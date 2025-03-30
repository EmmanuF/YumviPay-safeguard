
/**
 * API interactions for exchange rate data
 */
import { supabase } from '@/integrations/supabase/client';
import { getCachedRates, cacheRates, getExpiredCachedRates } from './cache';
import { getFallbackRates } from './fallback';

/**
 * Fetch latest exchange rate for a base currency using Supabase Edge Function
 * @param baseCurrency Base currency code (e.g. USD, EUR)
 * @returns Exchange rate data
 */
export const fetchExchangeRates = async (baseCurrency: string = 'USD'): Promise<Record<string, number>> => {
  try {
    console.log(`🌍 Fetching exchange rates for ${baseCurrency}...`);
    
    // Check cache first
    const cachedRates = getCachedRates(baseCurrency);
    if (cachedRates) {
      return cachedRates;
    }
    
    // Call the Supabase Edge Function
    console.log("🔄 Calling Supabase Edge Function for exchange rates");
    const { data, error } = await supabase.functions.invoke('exchange-rates', {
      body: { baseCurrency }
    });
    
    // Check for errors
    if (error) {
      console.error('❌ Supabase Edge Function error:', error);
      
      // Check for rate limiting errors (specific to API provider)
      if (error.message.includes('rate limit') || 
          error.message.includes('quota') || 
          error.message.includes('429')) {
        throw new Error(`API rate limit reached: ${error.message}`);
      }
      
      throw new Error(`Failed to fetch exchange rates: ${error.message}`);
    }
    
    // Check for valid response
    if (!data || !data.rates) {
      console.error('❌ Invalid response from exchange rate API:', data);
      throw new Error('Invalid response from exchange rate API');
    }
    
    console.log(`✅ Successfully fetched rates for ${baseCurrency} with ${Object.keys(data.rates).length} currencies`);
    console.log(`📊 Sample rates:`, {
      EUR: data.rates.EUR,
      GBP: data.rates.GBP,
      XAF: data.rates.XAF || 'N/A',
      lastUpdated: data.time_last_update_utc
    });
    
    // Update cache with new rates
    cacheRates(baseCurrency, data.rates);
    
    return data.rates;
  } catch (error) {
    console.error('❌ Error fetching exchange rates:', error);
    
    // Check if we have cached data (even if expired)
    // This prevents fallback when we just have a rate limit issue
    const expiredCacheData = getExpiredCachedRates(baseCurrency);
    
    if (expiredCacheData) {
      return expiredCacheData;
    }
    
    // Fallback to the static rates from the data file
    console.log('⚠️ Falling back to static exchange rates');
    return getFallbackRates(baseCurrency);
  }
};
