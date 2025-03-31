
/**
 * @deprecated Use the modular imports from './exchangeRate' instead
 * This file is kept for backward compatibility
 */
import { 
  getExchangeRate, 
  refreshExchangeRates,
  fetchExchangeRates,
  getFallbackRates,
  getFallbackExchangeRate,
} from './exchangeRate';

// Import CACHE_TTL from cache.ts
import { CACHE_TTL } from './exchangeRate/cache';

export {
  getExchangeRate,
  refreshExchangeRates,
  fetchExchangeRates,
  getFallbackRates,
  getFallbackExchangeRate,
  CACHE_TTL
};
