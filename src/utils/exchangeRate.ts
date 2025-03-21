
import { getExchangeRate } from '@/data/exchangeRates';

/**
 * Calculate the converted amount based on the exchange rate
 * @param amount The amount to convert
 * @param rate The exchange rate
 * @returns The converted amount
 */
export const calculateExchange = (amount: number, rate: number): number => {
  return amount * rate;
};

/**
 * Format the amount with proper currency formatting
 * @param amount The amount to format
 * @param currency The currency code
 * @returns Formatted currency string
 */
export const formatCurrencyAmount = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(amount);
};

export { getExchangeRate };
