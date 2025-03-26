
/**
 * Format a currency amount for display
 * @param amount The amount to format
 * @param currency The currency code (default: USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: string | number, currency = 'USD'): string => {
  if (amount === undefined || amount === null) return '$0.00';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount);
};

/**
 * Format a number with appropriate separators
 * @param amount The amount to format
 * @returns Formatted number string
 */
export const formatNumber = (amount: string | number): string => {
  if (amount === undefined || amount === null) return '0';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat('en-US').format(numAmount);
};

/**
 * Format transaction amount based on currency
 * @param amount Amount to format
 * @param options Formatting options
 * @returns Formatted amount string
 */
export const formatTransactionAmount = (
  amount: string | number | undefined,
  options?: {
    currency?: string;
    locale?: string;
  }
): string => {
  if (amount === undefined || amount === null) return '$0.00';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const currency = options?.currency || 'USD';
  const locale = options?.locale || 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount);
};

/**
 * Create a simple display value for an amount and currency
 */
export const getSimpleAmountDisplay = (amount: string | number | undefined, currency = 'USD'): string => {
  if (amount === undefined || amount === null) return '$0';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const symbol = currency === 'USD' ? '$' : currency === 'XAF' ? 'FCFA' : currency;
  
  return `${symbol}${new Intl.NumberFormat('en-US').format(numAmount)}`;
};
