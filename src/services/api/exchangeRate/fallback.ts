
/**
 * Fallback exchange rates for when API is unavailable
 */
import { exchangeRates as staticExchangeRates } from '@/data/exchangeRates';

// Normalize the exchange rates for easier lookup and cross-currency conversion
const normalizedRates: Record<string, Record<string, number>> = {};

// Cache for triangulated rates to avoid recalculating
const triangulationCache: Record<string, number> = {};

/**
 * Get fallback exchange rate between two currencies
 * @param sourceCurrency Source currency code
 * @param targetCurrency Target currency code
 * @returns Exchange rate value or 1 if not found
 */
export const getFallbackExchangeRate = (sourceCurrency: string, targetCurrency: string): number => {
  // Direct lookup: if same currency, rate is 1
  if (sourceCurrency === targetCurrency) {
    return 1;
  }
  
  // Check cache first for this pair
  const cacheKey = `${sourceCurrency}-${targetCurrency}`;
  if (triangulationCache[cacheKey]) {
    return triangulationCache[cacheKey];
  }
  
  // Try direct pair in our static exchange rates
  const directPair = `${sourceCurrency}-${targetCurrency}`;
  if (staticExchangeRates[directPair]) {
    console.log(`📊 Using direct fallback rate for ${directPair}: ${staticExchangeRates[directPair]}`);
    triangulationCache[cacheKey] = staticExchangeRates[directPair];
    return staticExchangeRates[directPair];
  }
  
  // Try reverse pair and invert the rate
  const reversePair = `${targetCurrency}-${sourceCurrency}`;
  if (staticExchangeRates[reversePair]) {
    const reverseRate = 1 / staticExchangeRates[reversePair];
    console.log(`📊 Using inverted fallback rate for ${reversePair}: ${reverseRate}`);
    triangulationCache[cacheKey] = reverseRate;
    return reverseRate;
  }
  
  // Try triangulation via USD
  if (sourceCurrency !== 'USD' && targetCurrency !== 'USD') {
    const sourceToDollar = staticExchangeRates[`USD-${sourceCurrency}`] 
      ? 1 / staticExchangeRates[`USD-${sourceCurrency}`] 
      : staticExchangeRates[`${sourceCurrency}-USD`];
      
    const dollarToTarget = staticExchangeRates[`USD-${targetCurrency}`];
    
    if (sourceToDollar && dollarToTarget) {
      const triangulatedRate = sourceToDollar * dollarToTarget;
      console.log(`📊 Using triangulated rate via USD for ${sourceCurrency} to ${targetCurrency}: ${triangulatedRate}`);
      triangulationCache[cacheKey] = triangulatedRate;
      return triangulatedRate;
    }
  }
  
  // Default to currency-specific estimate based on common exchange rates
  const estimatedRate = estimateRate(sourceCurrency, targetCurrency);
  console.log(`⚠️ Using estimated fallback rate for ${sourceCurrency} to ${targetCurrency}: ${estimatedRate}`);
  triangulationCache[cacheKey] = estimatedRate;
  return estimatedRate;
};

/**
 * Estimate an exchange rate based on currency properties
 */
const estimateRate = (sourceCurrency: string, targetCurrency: string): number => {
  // Common rough exchange rate estimates for unknown pairs
  const currencyValues: Record<string, number> = {
    'USD': 1.0,
    'EUR': 1.1,
    'GBP': 1.25,
    'CAD': 0.73,
    'AUD': 0.65,
    'JPY': 0.0069,
    'XAF': 0.0016,
    'XOF': 0.0016,
    'NGN': 0.00067,
    'GHS': 0.077,
    'KES': 0.0077,
    'ZAR': 0.055,
    'MAD': 0.10,
  };
  
  // Use USD as base if we don't know the currency
  const sourceValue = currencyValues[sourceCurrency] || 0.5;
  const targetValue = currencyValues[targetCurrency] || 0.5;
  
  // Calculate cross rate
  return targetValue > 0 ? sourceValue / targetValue : 1;
};

/**
 * Get all fallback rates for a given base currency
 * @param baseCurrency The base currency code
 * @returns Record of exchange rates with currency codes as keys
 */
export const getFallbackRates = (baseCurrency: string): Record<string, number> => {
  // Start with an empty rates object
  const rates: Record<string, number> = {};
  
  // Get all currencies from our static exchange rates
  const allCurrencies = new Set<string>();
  
  Object.keys(staticExchangeRates).forEach(pair => {
    const [source, target] = pair.split('-');
    allCurrencies.add(source);
    allCurrencies.add(target);
  });
  
  // Remove the base currency from the set
  allCurrencies.delete(baseCurrency);
  
  // For each currency, get the fallback rate
  allCurrencies.forEach(currency => {
    rates[currency] = getFallbackExchangeRate(baseCurrency, currency);
  });
  
  // Always include the base currency with rate 1
  rates[baseCurrency] = 1;
  
  console.log(`📊 Generated ${Object.keys(rates).length} fallback rates for ${baseCurrency}`);
  
  return rates;
};
