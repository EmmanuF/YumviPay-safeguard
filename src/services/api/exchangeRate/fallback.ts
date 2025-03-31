
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
  // Start with common fallback rates with USD as base
  const usdBasedRates: Record<string, number> = {
    USD: 1,
    EUR: 0.93,
    GBP: 0.79,
    CAD: 1.38,
    AUD: 1.53,
    XAF: 610,
    NGN: 1500,
    KES: 130,
    GHS: 13,
    NOK: 10.9,
    SEK: 10.7,
    DKK: 6.9,
    CHF: 0.91,
    JPY: 151.8,
    CNY: 7.24,
    INR: 83.5,
    BRL: 5.7,
    MXN: 17.9,
    ZAR: 18.6,
    RUB: 93.4,
    TRY: 32.3,
    NZD: 1.67,
    SGD: 1.35
  };
  
  // If the base currency is USD, just return the rates
  if (baseCurrency === 'USD') {
    return usdBasedRates;
  }
  
  // If the base currency is not USD, we need to convert all rates
  const result: Record<string, number> = {
    [baseCurrency]: 1 // Base currency is always 1
  };
  
  // First, find the USD to requested base currency rate
  const baseToUsdRate = 1 / (usdBasedRates[baseCurrency] || 1);
  
  // Convert all rates to the new base currency
  Object.keys(usdBasedRates).forEach(currency => {
    if (currency !== baseCurrency) {
      result[currency] = usdBasedRates[currency] * baseToUsdRate;
    }
  });
  
  return result;
};

/**
 * Get fallback exchange rate between two currencies from the static data
 * @param sourceCurrency Source currency code
 * @param targetCurrency Target currency code
 * @returns Fallback exchange rate
 */
export const getFallbackExchangeRate = (sourceCurrency: string, targetCurrency: string): number => {
  // Handle same currency case
  if (sourceCurrency === targetCurrency) {
    return 1;
  }
  
  // Try to get directly from the static data first
  const directPair = `${sourceCurrency}-${targetCurrency}`;
  const rate = exchangeRates[directPair];
  
  if (rate) {
    // If this is an XAF rate, add the 20 XAF markup
    if (targetCurrency === 'XAF') {
      return rate + 20;
    }
    return rate;
  }
  
  // For Cameroon-specific rates, use the fixed values with the 20 XAF markup
  if (targetCurrency === 'XAF') {
    // Check for common source currencies - extended set
    const xafRates: Record<string, number> = {
      'USD': 610,
      'EUR': 655.957,
      'GBP': 765.55,
      'CAD': 450,
      'AUD': 400,
      'NOK': 57.5,
      'SEK': 56.8,
      'DKK': 88.2,
      'CHF': 670,
      'JPY': 4.02,
      'CNY': 84.2,
      'INR': 7.3,
      'BRL': 107,
      'MXN': 34,
      'ZAR': 32.8,
      'RUB': 6.5,
      'TRY': 18.9,
      'NZD': 365,
      'SGD': 452
    };
    
    if (xafRates[sourceCurrency]) {
      return xafRates[sourceCurrency] + 20; // Add markup
    }
  }
  
  // Try to compute rate via USD as intermediary
  try {
    // Get rates with USD as base
    const usdRates = getFallbackRates('USD');
    
    // If we have both source and target currencies in USD rates
    if (usdRates[sourceCurrency] && usdRates[targetCurrency]) {
      // Calculate cross rate: source to USD, then USD to target
      const sourceToUsd = 1 / usdRates[sourceCurrency];
      const usdToTarget = usdRates[targetCurrency];
      const crossRate = sourceToUsd * usdToTarget;
      
      // Add markup for XAF
      return targetCurrency === 'XAF' ? (crossRate + 20) : crossRate;
    }
  } catch (e) {
    console.error('Error computing cross rate:', e);
  }
  
  // Default fallback with markup for XAF
  console.warn(`⚠️ No fallback rate found for ${sourceCurrency}-${targetCurrency}, using default`);
  return targetCurrency === 'XAF' ? 630 : 1;
};
