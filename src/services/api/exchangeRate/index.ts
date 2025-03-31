
/**
 * Exchange rate service for currency conversions
 */
import { fetchExchangeRates } from './api';
import { clearRatesCache, getRateFromCache, storeRateInCache } from './cache';
import { getFallbackExchangeRate } from './fallback';

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
    
    // Check cache first for faster response
    const cachedRate = getRateFromCache(sourceCurrency, targetCurrency);
    if (cachedRate !== null) {
      console.log(`📊 Using cached rate for ${sourceCurrency} to ${targetCurrency}: ${cachedRate}`);
      return cachedRate;
    }
    
    // Fetch latest rates with source currency as base
    const rates = await fetchExchangeRates(sourceCurrency);
    
    // Get the rate for target currency
    const rate = rates[targetCurrency];
    
    if (!rate) {
      console.warn(`⚠️ Exchange rate not found for ${sourceCurrency} to ${targetCurrency}`);
      const fallbackRate = getFallbackExchangeRate(sourceCurrency, targetCurrency);
      // Still cache the fallback rate to prevent constant lookups
      storeRateInCache(sourceCurrency, targetCurrency, fallbackRate);
      return fallbackRate;
    }
    
    console.log(`📊 Current rate: 1 ${sourceCurrency} = ${rate} ${targetCurrency}`);
    
    // Cache the fetched rate
    storeRateInCache(sourceCurrency, targetCurrency, rate);
    
    return rate;
  } catch (error) {
    console.error('❌ Error getting exchange rate:', error);
    const fallbackRate = getFallbackExchangeRate(sourceCurrency, targetCurrency);
    return fallbackRate;
  }
};

/**
 * Force refresh the exchange rate cache and fetch new rates
 * @param baseCurrency Base currency code
 * @returns Updated exchange rates
 */
export const refreshExchangeRates = async (baseCurrency: string = 'USD'): Promise<Record<string, number>> => {
  try {
    // Clear the cache for this currency
    clearRatesCache(baseCurrency);
    
    // Fetch fresh rates
    console.log(`🔄 Force refreshing exchange rates for ${baseCurrency}...`);
    return await fetchExchangeRates(baseCurrency);
  } catch (error) {
    console.error('❌ Error refreshing exchange rates:', error);
    throw error; // Re-throw to let caller handle the error
  }
};

// Re-export everything for backward compatibility
export * from './api';
export * from './cache';
export * from './fallback';
