
/**
 * Generate a unique transaction ID
 */
export const generateTransactionId = (): string => {
  return `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

/**
 * Format currency amount based on locale
 */
export const formatCurrency = (
  amount: number | string,
  currency = 'USD',
  locale = 'en-US'
): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return '0.00';
  }
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(numericAmount);
  } catch (e) {
    return `${currency} ${numericAmount.toFixed(2)}`;
  }
};

/**
 * Get estimated delivery text based on payment method
 */
export const getEstimatedDeliveryText = (paymentMethod: string): string => {
  switch (paymentMethod) {
    case 'mtn-mobile-money':
    case 'orange-money':
      return 'Usually within 5 minutes';
    case 'bank-transfer':
      return '1-2 business days';
    case 'cash-pickup':
      return 'Available immediately for pickup';
    default:
      return 'Processing';
  }
};
