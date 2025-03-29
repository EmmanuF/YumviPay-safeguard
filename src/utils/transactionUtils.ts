
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

/**
 * Calculate transaction fee based on amount and country
 * @param amount Transaction amount
 * @param country Recipient country code
 * @returns Fee amount
 */
export const calculateFee = (amount: string | number, country: string): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return '0.00';
  }
  
  // Fee calculation logic - simple percentage based on country
  let feePercentage = 0.05; // Default 5%
  
  switch(country.toUpperCase()) {
    case 'CM': // Cameroon
      feePercentage = 0.03; // 3%
      break;
    case 'NG': // Nigeria
      feePercentage = 0.04; // 4%
      break;
    case 'GH': // Ghana
      feePercentage = 0.035; // 3.5%
      break;
    default:
      feePercentage = 0.05; // 5% for others
  }
  
  const feeAmount = numericAmount * feePercentage;
  return feeAmount.toFixed(2);
};

/**
 * Calculate total transaction amount including fees
 * @param amount Base transaction amount
 * @param fee Fee amount
 * @returns Total amount
 */
export const calculateTotal = (amount: string | number, fee: string | number): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const numericFee = typeof fee === 'string' ? parseFloat(fee) : fee;
  
  if (isNaN(numericAmount) || isNaN(numericFee)) {
    return '0.00';
  }
  
  const total = numericAmount + numericFee;
  return total.toFixed(2);
};

/**
 * Get estimated delivery time based on country and payment method
 * @param country Recipient country code
 * @param paymentMethod Payment method used
 * @returns Estimated delivery text
 */
export const getEstimatedDelivery = (country: string, paymentMethod: string): string => {
  // First check by payment method
  switch (paymentMethod) {
    case 'mtn-mobile-money':
    case 'orange-money':
      return 'Usually within 5 minutes';
    case 'bank-transfer':
      return '1-2 business days';
    case 'cash-pickup':
      return 'Available immediately for pickup';
  }
  
  // Fallback to country-based estimation if payment method is not recognized
  switch (country.toUpperCase()) {
    case 'CM': // Cameroon
      return 'Usually within 1 hour';
    case 'NG': // Nigeria
      return 'Usually within 2 hours';
    case 'GH': // Ghana
      return 'Usually within 3 hours';
    default:
      return 'Processing';
  }
};
