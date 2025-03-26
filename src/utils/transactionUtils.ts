
/**
 * Utility functions for transaction management
 */

/**
 * Generates a unique transaction ID
 * Format: TXN-{timestamp}-{random}
 */
export const generateTransactionId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TXN-${timestamp}-${random}`;
};

/**
 * Formats a transaction status for display
 */
export const formatTransactionStatus = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'processing':
      return 'Processing';
    case 'completed':
      return 'Completed';
    case 'failed':
      return 'Failed';
    case 'cancelled':
      return 'Cancelled';
    case 'refunded':
      return 'Refunded';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

/**
 * Calculate fee for a transaction
 */
export const calculateFee = (amount: string | number, country: string): string => {
  // Basic fee calculation
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const baseFee = numericAmount * 0.03; // 3% fee
  const minFee = 1.0; // Minimum fee of $1
  const fee = Math.max(baseFee, minFee);
  return fee.toFixed(2);
};

/**
 * Calculate total amount including fee
 */
export const calculateTotal = (amount: string | number, fee: string | number): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const numericFee = typeof fee === 'string' ? parseFloat(fee) : fee;
  return (numericAmount + numericFee).toFixed(2);
};

/**
 * Get estimated delivery time based on country and payment method
 */
export const getEstimatedDelivery = (country: string, paymentMethod?: string): string => {
  // Different delivery estimates based on country and payment method
  if (country === 'CM') {
    if (paymentMethod === 'mobile_money') {
      return 'Instant to 15 minutes';
    } else if (paymentMethod === 'bank_transfer') {
      return '1-2 business days';
    }
  }
  
  // Default fallback
  return '1-3 business days';
};
