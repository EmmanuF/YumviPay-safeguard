
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
  CACHE_TTL
} from './exchangeRate';

export {
  getExchangeRate,
  refreshExchangeRates,
  fetchExchangeRates,
  getFallbackRates,
  getFallbackExchangeRate,
  CACHE_TTL
};
