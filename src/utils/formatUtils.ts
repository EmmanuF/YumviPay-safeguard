
/**
 * Format a date for display
 * @param date - The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return 'Unknown';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format currency for display
 * @param amount - The amount to format
 * @param currency - The currency code (default: USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: string | number | undefined, currency: string = 'USD'): string => {
  if (amount === undefined) return '$0.00';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(numAmount);
};

/**
 * Format a number with commas
 * @param value - The value to format
 * @returns Formatted number string
 */
export const formatNumberWithCommas = (value: string | number): string => {
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) return '0';
    return parsed.toLocaleString();
  }
  return value.toLocaleString();
};

/**
 * Clean a numeric string by removing commas
 * @param value - The string to clean
 * @returns Cleaned numeric string
 */
export const cleanNumericString = (value: string): string => {
  return value.replace(/,/g, '');
};
