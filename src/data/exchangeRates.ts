
// Exchange rates between currencies (e.g., 'USD-NGN': 1500 means 1 USD = 1500 NGN)
export const exchangeRates: Record<string, number> = {
  'USD-NGN': 1500,
  'USD-KES': 130,
  'USD-GHS': 13,
  'USD-ZAR': 18,
  'USD-UGX': 3800,
  'USD-TZS': 2500,
  'USD-RWF': 1200,
  'USD-ETB': 57,
  'USD-XOF': 610,
  'USD-XAF': 610,
  'USD-CDF': 2500,
  'GBP-NGN': 1900,
  'EUR-NGN': 1650,
  'CAD-NGN': 1100,
  'AUD-NGN': 980,
  'JPY-NGN': 10,
  'GBP-KES': 165,
  'EUR-KES': 143,
  'CAD-KES': 95,
  'GBP-GHS': 16.5,
  'EUR-GHS': 14.3,
  'CAD-GHS': 9.5,
  'GBP-ZAR': 23,
  'EUR-ZAR': 19.8,
  'CAD-ZAR': 13.5,
  'EUR-XOF': 655,
  'GBP-XOF': 760,
  'EUR-XAF': 655,
  'GBP-XAF': 760,
  'EUR-CDF': 2200,
  'GBP-CDF': 2600,
  
  // Exchange rates for new sending countries to common receiving countries
  'MXN-NGN': 83,
  'PAB-NGN': 1500,
  'CHF-NGN': 1700,
  'SGD-NGN': 1120,
  'NZD-NGN': 915,
  'AED-NGN': 408,
  'QAR-NGN': 412,
  'SAR-NGN': 400,
  
  'MXN-KES': 7.2,
  'PAB-KES': 130,
  'CHF-KES': 147,
  'SGD-KES': 97,
  'NZD-KES': 79,
  'AED-KES': 35.4,
  'QAR-KES': 35.7,
  'SAR-KES': 34.7,
  
  'MXN-GHS': 0.72,
  'PAB-GHS': 13,
  'CHF-GHS': 14.7,
  'SGD-GHS': 9.7,
  'NZD-GHS': 7.9,
  'AED-GHS': 3.54,
  'QAR-GHS': 3.57,
  'SAR-GHS': 3.47,
  
  'MXN-ZAR': 1,
  'PAB-ZAR': 18,
  'CHF-ZAR': 20.3,
  'SGD-ZAR': 13.4,
  'NZD-ZAR': 10.9,
  'AED-ZAR': 4.9,
  'QAR-ZAR': 4.95,
  'SAR-ZAR': 4.8,
  
  // Cameroon exchange rates
  'XAF-USD': 0.00164,
  'XAF-EUR': 0.00152,
  'XAF-GBP': 0.00132,
  'XAF-NGN': 2.46,
  'XAF-KES': 0.213,
  'XAF-GHS': 0.0213,
  'XAF-ZAR': 0.0295,
  'XAF-UGX': 6.23,
  'XAF-TZS': 4.10,
  'XAF-RWF': 1.97,
  'XAF-ETB': 0.0934,
  'XAF-XOF': 1.0, // Equal value as they're both pegged to EUR
  'XAF-CDF': 4.10,
  
  // Additional rates for Western countries to Cameroon
  'CAD-XAF': 450,
  'AUD-XAF': 400,
  'CHF-XAF': 680,
  'JPY-XAF': 4.15,
  'MXN-XAF': 34,
  'SGD-XAF': 450,
  'AED-XAF': 166,
  'QAR-XAF': 167,
  'SAR-XAF': 162,
};

// Function to get exchange rate between two currencies
export const getExchangeRate = (sourceCurrency: string, targetCurrency: string): number => {
  const pair = `${sourceCurrency}-${targetCurrency}`;
  return exchangeRates[pair] || 1; // Default to 1 if rate not found
};
