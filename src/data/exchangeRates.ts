
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
};

// Function to get exchange rate between two currencies
export const getExchangeRate = (sourceCurrency: string, targetCurrency: string): number => {
  const pair = `${sourceCurrency}-${targetCurrency}`;
  return exchangeRates[pair] || 1; // Default to 1 if rate not found
};
