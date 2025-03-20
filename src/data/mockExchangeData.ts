
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
    console.log(`No mock exchange rate found for ${sourceCurrency}-${targetCurrency}, using default rate ${defaultRate}`);
    return defaultRate;
  }
  
  const rate = mockExchangeRates[sourceCurrency][targetCurrency];
  console.log(`Using mock exchange rate for ${sourceCurrency}-${targetCurrency}: ${rate}`);
  return rate;
}

// Mock country data structure with minimum fields required
export interface MockCountry {
  code: string;
  name: string;
  flagUrl: string;
  currency: string;
  isSendingEnabled: boolean;
  isReceivingEnabled: boolean;
}

// Generate mock countries data with required properties
export function generateMockCountries(): MockCountry[] {
  const countries: MockCountry[] = [
    // Sending countries
    {
      code: 'US',
      name: 'United States',
      flagUrl: 'https://flagcdn.com/w320/us.png',
      currency: 'USD',
      isSendingEnabled: true,
      isReceivingEnabled: false
    },
    {
      code: 'EU', // Not a real country code but works for our mocks
      name: 'European Union',
      flagUrl: 'https://flagcdn.com/w320/eu.png',
      currency: 'EUR',
      isSendingEnabled: true,
      isReceivingEnabled: false
    },
    {
      code: 'GB',
      name: 'United Kingdom',
      flagUrl: 'https://flagcdn.com/w320/gb.png',
      currency: 'GBP',
      isSendingEnabled: true,
      isReceivingEnabled: false
    },
    {
      code: 'CA',
      name: 'Canada',
      flagUrl: 'https://flagcdn.com/w320/ca.png',
      currency: 'CAD',
      isSendingEnabled: true,
      isReceivingEnabled: false
    },
    {
      code: 'CH',
      name: 'Switzerland',
      flagUrl: 'https://flagcdn.com/w320/ch.png',
      currency: 'CHF',
      isSendingEnabled: true,
      isReceivingEnabled: false
    },
    {
      code: 'AU',
      name: 'Australia',
      flagUrl: 'https://flagcdn.com/w320/au.png',
      currency: 'AUD',
      isSendingEnabled: true,
      isReceivingEnabled: false
    },
    
    // Receiving countries (African countries)
    {
      code: 'CM',
      name: 'Cameroon',
      flagUrl: 'https://flagcdn.com/w320/cm.png',
      currency: 'XAF',
      isSendingEnabled: false,
      isReceivingEnabled: true
    },
    {
      code: 'NG',
      name: 'Nigeria',
      flagUrl: 'https://flagcdn.com/w320/ng.png',
      currency: 'NGN',
      isSendingEnabled: false,
      isReceivingEnabled: true
    },
    {
      code: 'GH',
      name: 'Ghana',
      flagUrl: 'https://flagcdn.com/w320/gh.png',
      currency: 'GHS',
      isSendingEnabled: false,
      isReceivingEnabled: true
    },
    {
      code: 'KE',
      name: 'Kenya',
      flagUrl: 'https://flagcdn.com/w320/ke.png',
      currency: 'KES',
      isSendingEnabled: false,
      isReceivingEnabled: true
    },
    {
      code: 'ZA',
      name: 'South Africa',
      flagUrl: 'https://flagcdn.com/w320/za.png',
      currency: 'ZAR',
      isSendingEnabled: false,
      isReceivingEnabled: true
    },
    {
      code: 'UG',
      name: 'Uganda',
      flagUrl: 'https://flagcdn.com/w320/ug.png',
      currency: 'UGX',
      isSendingEnabled: false,
      isReceivingEnabled: true
    },
    {
      code: 'TZ',
      name: 'Tanzania',
      flagUrl: 'https://flagcdn.com/w320/tz.png',
      currency: 'TZS',
      isSendingEnabled: false,
      isReceivingEnabled: true
    }
  ];
  
  return countries;
}

// Helper function to get a mock country by currency
export function getMockCountryByCurrency(currency: string, type: 'sending' | 'receiving' = 'receiving'): MockCountry | null {
  const mockCountries = generateMockCountries();
  
  // Filter by type and currency
  if (type === 'sending') {
    return mockCountries.find(c => c.currency === currency && c.isSendingEnabled) || null;
  } else {
    return mockCountries.find(c => c.currency === currency && c.isReceivingEnabled) || null;
  }
}

// Helper to get mock sending countries currencies
export function getMockSendingCurrencies(): string[] {
  return mockSendingCurrencies;
}

// Helper to get mock receiving countries currencies
export function getMockReceivingCurrencies(): string[] {
  return mockReceivingCurrencies;
}
