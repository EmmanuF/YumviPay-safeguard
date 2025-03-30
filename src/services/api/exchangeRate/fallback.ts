
/**
 * Fallback exchange rates when the API is unavailable
 */
import { exchangeRates } from '@/data/exchangeRates';

/**
 * Get fallback exchange rates for a base currency from the static data
 * @param baseCurrency Base currency code
 * @returns Fallback rates with the specified base currency
 */
export const getFallbackRates = (baseCurrency: string): Record<string, number> => {
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
 * @param sourceCurrency Source currency code
 * @param targetCurrency Target currency code
 * @returns Fallback exchange rate
 */
export const getFallbackExchangeRate = (sourceCurrency: string, targetCurrency: string): number => {
  // Try to get from the static data first
  const pair = `${sourceCurrency}-${targetCurrency}`;
  const rate = exchangeRates[pair];
  
  if (rate) {
    // If this is an XAF rate, add the 20 XAF markup
    if (targetCurrency === 'XAF') {
      return rate + 20;
    }
    return rate;
  }
  
  // For Cameroon-specific rates, use the fixed values with the 20 XAF markup
  if (targetCurrency === 'XAF' && sourceCurrency === 'USD') {
    return 610 + 20;
  } else if (targetCurrency === 'XAF' && sourceCurrency === 'EUR') {
    return 655.957 + 20;
  } else if (targetCurrency === 'XAF' && sourceCurrency === 'GBP') {
    return 765.55 + 20;
  }
  
  // Default fallback with markup for XAF
  return targetCurrency === 'XAF' ? (610 + 20) : 1;
};
