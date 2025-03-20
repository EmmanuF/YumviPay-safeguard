
// Mock data for exchange rate calculator functionality

// Mock sending countries data (currencies that can be sent from)
export const mockSendingCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'CHF', 'AUD'];

// Mock receiving countries data (currencies that can be received)
export const mockReceivingCurrencies = ['XAF', 'NGN', 'GHS', 'KES', 'ZAR', 'UGX', 'TZS'];

// Fixed exchange rates for offline use
export const mockExchangeRates: Record<string, Record<string, number>> = {
  'USD': {
    'XAF': 610.25,
    'NGN': 1504.37,
    'GHS': 15.83,
    'KES': 130.42,
    'ZAR': 18.35,
    'UGX': 3750.28,
    'TZS': 2620.75
  },
  'EUR': {
    'XAF': 656.35,
    'NGN': 1640.72,
    'GHS': 17.26,
    'KES': 142.18,
    'ZAR': 20.01,
    'UGX': 4089.35,
    'TZS': 2857.64
  },
  'GBP': {
    'XAF': 766.82,
    'NGN': 1916.34,
    'GHS': 20.15,
    'KES': 166.07,
    'ZAR': 23.38,
    'UGX': 4775.93,
    'TZS': 3337.25
  },
  'CAD': {
    'XAF': 447.38,
    'NGN': 1118.52,
    'GHS': 11.76,
    'KES': 96.90,
    'ZAR': 13.64,
    'UGX': 2786.45,
    'TZS': 1947.32
  },
  'CHF': {
    'XAF': 676.83,
    'NGN': 1692.45,
    'GHS': 17.80,
    'KES': 146.68,
    'ZAR': 20.64,
    'UGX': 4218.50,
    'TZS': 2947.24
  },
  'AUD': {
    'XAF': 398.72,
    'NGN': 996.38,
    'GHS': 10.47,
    'KES': 86.32,
    'ZAR': 12.15,
    'UGX': 2482.63,
    'TZS': 1735.16
  }
};

// Helper function to get exchange rate from mock data
export function getMockExchangeRate(sourceCurrency: string, targetCurrency: string): number {
  // Default fallback rate
  const defaultRate = 600;
  
  // If either currency is not in our mock data, return default rate
  if (!mockExchangeRates[sourceCurrency] || !mockExchangeRates[sourceCurrency][targetCurrency]) {
    return defaultRate;
  }
  
  return mockExchangeRates[sourceCurrency][targetCurrency];
}

// Mock country data structure with minimum fields required
export interface MockCountry {
  currency: string;
  isSendingEnabled: boolean;
  isReceivingEnabled: boolean;
}

// Generate mock countries data with required properties
export function generateMockCountries(): MockCountry[] {
  const countries: MockCountry[] = [];
  
  // Add sending countries
  mockSendingCurrencies.forEach(currency => {
    countries.push({
      currency,
      isSendingEnabled: true,
      isReceivingEnabled: false
    });
  });
  
  // Add receiving countries
  mockReceivingCurrencies.forEach(currency => {
    countries.push({
      currency,
      isSendingEnabled: false,
      isReceivingEnabled: true
    });
  });
  
  return countries;
}
