import { get } from '@/services/api';
import { exchangeRates } from '@/data/exchangeRates';
import { supabase } from '@/integrations/supabase/client';

// Cache for exchange rates to reduce API calls
const exchangeRateCache: Record<string, { 
  rates: Record<string, number>;
  timestamp: number; 
  expiry: number;
}> = {};

// Cache TTL in milliseconds (2 minutes - reduced for more frequent updates)
const CACHE_TTL = 2 * 60 * 1000;

/**
 * Fetch latest exchange rate for a base currency using Supabase Edge Function
 * @param baseCurrency Base currency code (e.g. USD, EUR)
 * @returns Exchange rate data
 */
export const fetchExchangeRates = async (baseCurrency: string = 'USD'): Promise<Record<string, number>> => {
  try {
    console.log(`🌍 Fetching exchange rates for ${baseCurrency}...`);
    
    // Check cache first
    const cacheKey = baseCurrency;
    const now = Date.now();
    const cachedData = exchangeRateCache[cacheKey];
    
    if (cachedData && now < cachedData.expiry) {
      console.log(`💰 Using cached exchange rates for ${baseCurrency} (expires in ${Math.round((cachedData.expiry - now) / 1000)}s)`);
      return cachedData.rates;
    }
    
    // Call the Supabase Edge Function
    console.log("🔄 Calling Supabase Edge Function for exchange rates");
    const { data, error } = await supabase.functions.invoke('exchange-rates', {
      body: { baseCurrency }
    });
    
    // Check for errors
    if (error) {
      console.error('❌ Supabase Edge Function error:', error);
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
    exchangeRateCache[cacheKey] = {
      rates: data.rates,
      timestamp: now,
      expiry: now + CACHE_TTL
    };
    
    return data.rates;
  } catch (error) {
    console.error('❌ Error fetching exchange rates:', error);
    
    // Fallback to the static rates from the data file
    console.log('⚠️ Falling back to static exchange rates');
    return getFallbackRates(baseCurrency);
  }
};

/**
 * Get exchange rate between two currencies
 * @param sourceCurrency Source currency code
 * @param targetCurrency Target currency code
 * @returns Exchange rate value or fallback if unavailable
 */
export const getExchangeRate = async (
  sourceCurrency: string, 
  targetCurrency: string
): Promise<number> => {
  try {
    // If source is the same as target, rate is 1
    if (sourceCurrency === targetCurrency) {
      return 1;
    }
    
    // Fetch latest rates with source currency as base
    const rates = await fetchExchangeRates(sourceCurrency);
    
    // Get the rate for target currency
    const rate = rates[targetCurrency];
    
    if (!rate) {
      console.warn(`⚠️ Exchange rate not found for ${sourceCurrency} to ${targetCurrency}`);
      return getFallbackExchangeRate(sourceCurrency, targetCurrency);
    }
    
    console.log(`📊 Current rate: 1 ${sourceCurrency} = ${rate} ${targetCurrency}`);
    return rate;
  } catch (error) {
    console.error('❌ Error getting exchange rate:', error);
    return getFallbackExchangeRate(sourceCurrency, targetCurrency);
  }
};

/**
 * Force refresh the exchange rate cache and fetch new rates
 * @param baseCurrency Base currency code
 * @returns Updated exchange rates
 */
export const refreshExchangeRates = async (baseCurrency: string = 'USD'): Promise<Record<string, number>> => {
  // Clear the cache for this currency
  const cacheKey = baseCurrency;
  delete exchangeRateCache[cacheKey];
  
  // Fetch fresh rates
  console.log(`🔄 Force refreshing exchange rates for ${baseCurrency}...`);
  return fetchExchangeRates(baseCurrency);
};

/**
 * Get fallback exchange rates for a base currency from the static data
 */
const getFallbackRates = (baseCurrency: string): Record<string, number> => {
  // Start with common fallback rates
  const fallbackRates: Record<string, number> = {
    USD: 1,
    EUR: 0.93,
    GBP: 0.79,
    CAD: 1.38,
    AUD: 1.53,
    XAF: 610,
    NGN: 1500,
    KES: 130,
    GHS: 13,
  };
  
  // If the base currency is not USD, we need to adjust the rates
  if (baseCurrency !== 'USD') {
    const inverseRateToUSD = 1 / (fallbackRates[baseCurrency] || 1);
    
    // Adjust all rates relative to the new base currency
    Object.keys(fallbackRates).forEach(currency => {
      if (currency !== baseCurrency) {
        fallbackRates[currency] = fallbackRates[currency] * inverseRateToUSD;
      }
    });
    
    // The base currency rate is always 1
    fallbackRates[baseCurrency] = 1;
  }
  
  return fallbackRates;
};

/**
 * Get fallback exchange rate between two currencies from the static data
 */
const getFallbackExchangeRate = (sourceCurrency: string, targetCurrency: string): number => {
  // Try to get from the static data first
  const pair = `${sourceCurrency}-${targetCurrency}`;
  const rate = exchangeRates[pair];
  
  if (rate) {
    return rate;
  }
  
  // For Cameroon-specific rates, use the fixed values
  if (targetCurrency === 'XAF' && sourceCurrency === 'USD') {
    return 610;
  } else if (targetCurrency === 'XAF' && sourceCurrency === 'EUR') {
    return 655.957;
  } else if (targetCurrency === 'XAF' && sourceCurrency === 'GBP') {
    return 765.55;
  }
  
  // Default fallback
  return targetCurrency === 'XAF' ? 610 : 1;
};
