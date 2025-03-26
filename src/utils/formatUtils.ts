/**
 * Format currency value with proper currency symbol and localization
 * @param amount Amount to format
 * @param currencyCode ISO currency code (USD, EUR, XAF, etc.)
 * @param locale Locale for formatting (default: en-US)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number | string,
  currencyCode: string = 'USD',
  locale: string = 'en-US'
): string => {
  // Handle string amounts
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Handle NaN or invalid values
  if (isNaN(numericAmount)) {
    return `0.00 ${currencyCode}`;
  }
  
  try {
    // Use Intl.NumberFormat for proper formatting
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericAmount);
  } catch (error) {
    // Fallback for unsupported currency codes
    return `${numericAmount.toFixed(2)} ${currencyCode}`;
  }
};

/**
 * Format large numbers with commas for better readability
 * @param value Number to format
 * @returns Formatted number string
 */
export const formatNumberWithCommas = (value: number | string): string => {
  // Handle string values
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Handle NaN or invalid values
  if (isNaN(numericValue)) {
    return '0';
  }
  
  // Use Intl.NumberFormat for proper formatting
  return new Intl.NumberFormat().format(numericValue);
};

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
