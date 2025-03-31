
/**
 * Cache service for exchange rates
 */

// Use a memory cache for exchange rates to reduce API calls
// Format: sourceCurrency-targetCurrency => {rate, timestamp}
type RateCacheEntry = {
  rate: number;
  timestamp: number;
};

const ratesCache: Record<string, RateCacheEntry> = {};

// Cache expiration time (24 hours by default)
const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000;

/**
 * Get cached exchange rate if available and not expired
 */
export const getRateFromCache = (
  sourceCurrency: string,
  targetCurrency: string
): number | null => {
  const cacheKey = `${sourceCurrency}-${targetCurrency}`;
  const cachedEntry = ratesCache[cacheKey];
  
  if (!cachedEntry) {
    return null;
  }
  
  // Check if cache has expired
  const now = Date.now();
  if (now - cachedEntry.timestamp > CACHE_EXPIRATION_MS) {
    console.log(`🕒 Cached exchange rate for ${cacheKey} has expired`);
    delete ratesCache[cacheKey];
    return null;
  }
  
  return cachedEntry.rate;
};

/**
 * Store exchange rate in cache
 */
export const storeRateInCache = (
  sourceCurrency: string,
  targetCurrency: string,
  rate: number
): void => {
  const cacheKey = `${sourceCurrency}-${targetCurrency}`;
  ratesCache[cacheKey] = {
    rate,
    timestamp: Date.now()
  };
  console.log(`💾 Stored exchange rate in cache: ${cacheKey} = ${rate}`);
};

/**
 * Clear all cached rates for a specific currency
 */
export const clearRatesCache = (currency: string): void => {
  // Remove all cache entries that include this currency
  Object.keys(ratesCache).forEach(key => {
    if (key.includes(currency)) {
      delete ratesCache[key];
    }
  });
  console.log(`🔄 Cleared exchange rate cache for ${currency}`);
};

/**
 * Clear all rates cache
 */
export const clearAllRatesCache = (): void => {
  Object.keys(ratesCache).forEach(key => {
    delete ratesCache[key];
  });
  console.log('🔄 Cleared all exchange rate cache');
};
