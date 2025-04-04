
/**
 * Cache mechanism for exchange rates to reduce API calls
 */

// Cache for exchange rates to reduce API calls
const exchangeRateCache: Record<string, { 
  rates: Record<string, number>;
  timestamp: number; 
  expiry: number;
}> = {};

// Cache TTL in milliseconds (8 hours to match the update frequency)
export const CACHE_TTL = 8 * 60 * 60 * 1000;

/**
 * Get cached exchange rates if available and not expired
 * @param baseCurrency The base currency code
 * @returns The cached rates or null if no valid cache exists
 */
export const getCachedRates = (baseCurrency: string): Record<string, number> | null => {
  const cacheKey = baseCurrency;
  const now = Date.now();
  const cachedData = exchangeRateCache[cacheKey];
  
  if (cachedData && now < cachedData.expiry) {
    const timeRemaining = Math.round((cachedData.expiry - now) / 60000); // in minutes
    console.log(`💰 Using cached exchange rates for ${baseCurrency} (expires in ${timeRemaining} minutes)`);
    return cachedData.rates;
  }
  
  console.log(`❓ No valid cache found for ${baseCurrency} or cache expired`);
  return null;
};

/**
 * Store exchange rates in the cache
 * @param baseCurrency The base currency code
 * @param rates The exchange rate data to cache
 */
export const cacheRates = (baseCurrency: string, rates: Record<string, number>): void => {
  const now = Date.now();
  const cacheKey = baseCurrency;
  
  exchangeRateCache[cacheKey] = {
    rates,
    timestamp: now,
    expiry: now + CACHE_TTL
  };
  
  console.log(`💾 Cached exchange rates for ${baseCurrency} (expires in 8 hours)`);
  
  // Debug log the current cache state
  console.log(`🗄️ Current cache state:`, Object.keys(exchangeRateCache).map(key => ({
    currency: key,
    timestamp: new Date(exchangeRateCache[key].timestamp).toISOString(),
    expiry: new Date(exchangeRateCache[key].expiry).toISOString()
  })));
};

/**
 * Get cached exchange rates even if expired (for fallback)
 * @param baseCurrency The base currency code
 * @returns The cached rates or null if no cache exists
 */
export const getExpiredCachedRates = (baseCurrency: string): Record<string, number> | null => {
  const cacheKey = baseCurrency;
  const cachedData = exchangeRateCache[cacheKey];
  
  if (cachedData) {
    console.log('⚠️ Using expired cache data due to API error');
    // Extend the cache expiry to prevent further API calls
    cachedData.expiry = Date.now() + CACHE_TTL;
    return cachedData.rates;
  }
  
  return null;
};

/**
 * Clear the cache for a specific currency
 * @param baseCurrency The base currency code
 */
export const clearRatesCache = (baseCurrency: string): void => {
  const cacheKey = baseCurrency;
  delete exchangeRateCache[cacheKey];
  console.log(`🔄 Cleared exchange rate cache for ${baseCurrency}`);
};
