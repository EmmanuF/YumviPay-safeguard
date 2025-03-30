import { get } from '@/services/api';
import { exchangeRates } from '@/data/exchangeRates';

// API key for exchangerate-api.com
// This would be better stored in a server-side environment variable,
// but for demo purposes we'll use it directly
const EXCHANGE_RATE_API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key

// Exchange Rate API endpoint with API key
const EXCHANGE_RATE_API_URL = 'https://v6.exchangerate-api.com/v6/';

// Interface for API responses from exchangerate-api.com
interface ExchangeRateApiResponse {
  result?: string;
  documentation?: string;
  terms_of_use?: string;
  time_last_update_unix?: number;
  time_last_update_utc?: string;
  time_next_update_unix?: number;
  time_next_update_utc?: string;
  base_code?: string;
  rates?: Record<string, number>;
  error?: string;
  error_type?: string;
}

// Cache for exchange rates to reduce API calls
const exchangeRateCache: Record<string, { 
  rates: Record<string, number>;
  timestamp: number; 
  expiry: number;
}> = {};

// Cache TTL in milliseconds (2 minutes - reduced from 5 to get more frequent updates)
const CACHE_TTL = 2 * 60 * 1000;

/**
 * Fetch latest exchange rate for a base currency
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
    
    // Construct API URL with API key
    const apiUrl = `${EXCHANGE_RATE_API_URL}${EXCHANGE_RATE_API_KEY}/latest/${baseCurrency}`;
    console.log(`🔄 Fetching rates from: ${apiUrl}`);
    
    // Fetch latest rates from API
    const response = await get<ExchangeRateApiResponse>(apiUrl, {
      cacheable: true,
      cacheTTL: CACHE_TTL,
      timeout: 5000,
      retry: true,
      maxRetries: 2
    });
    
    // Check for valid response
    if (!response || !response.rates) {
      console.error('❌ Invalid response from exchange rate API:', response);
      throw new Error('Invalid response from exchange rate API');
    }
    
    console.log(`✅ Successfully fetched rates for ${baseCurrency} with ${Object.keys(response.rates).length} currencies`);
    console.log(`📊 Sample rates:`, {
      EUR: response.rates.EUR,
      GBP: response.rates.GBP,
      XAF: response.rates.XAF || 'N/A',
      lastUpdated: response.time_last_update_utc
    });
    
    // Update cache with new rates
    exchangeRateCache[cacheKey] = {
      rates: response.rates,
      timestamp: now,
      expiry: now + CACHE_TTL
    };
    
    return response.rates;
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
