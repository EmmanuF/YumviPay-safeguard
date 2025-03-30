/**
 * Exchange rate service for currency conversions
 */
import { fetchExchangeRates } from './api';
import { clearRatesCache } from './cache';
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
    
    // Fetch latest rates with source currency as base
    const rates = await fetchExchangeRates(sourceCurrency);
    
    // Get the rate for target currency
    const rate = rates[targetCurrency];
    
    if (!rate) {
      console.warn(`⚠️ Exchange rate not found for ${sourceCurrency} to ${targetCurrency}`);
      return getFallbackExchangeRate(sourceCurrency, targetCurrency);
    }
    
    // Apply the 20 XAF markup specifically for XAF currency here if necessary,
    // but we're now handling this in the hook instead to keep the raw rate data clean
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
  clearRatesCache(baseCurrency);
  
  // Fetch fresh rates
  console.log(`🔄 Force refreshing exchange rates for ${baseCurrency}...`);
  return fetchExchangeRates(baseCurrency);
};

// Re-export everything for backward compatibility
export * from './api';
export * from './cache';
export * from './fallback';
