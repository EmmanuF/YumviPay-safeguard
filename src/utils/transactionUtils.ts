
/**
 * Utilities for handling transactions
 */

/**
 * Generates a unique transaction ID with TXN prefix
 */
export const generateTransactionId = (): string => {
  return `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

/**
 * Validates if a string is a valid transaction ID
 */
export const isValidTransactionId = (id: string): boolean => {
  return id && id.startsWith('TXN-');
};

/**
 * Formats a transaction ID for display
 */
export const formatTransactionId = (id: string): string => {
  if (!id) return 'Unknown';
  
  // Extract the timestamp and random part
  const parts = id.split('-');
  if (parts.length < 3) return id;
  
  const timestampPart = parts[1];
  const randomPart = parts[2];
  
  // Show last 4 digits of timestamp and full random part
  const shortTimestamp = timestampPart.slice(-4);
  
  return `TXN-${shortTimestamp}-${randomPart}`;
};

/**
 * Calculates fee for a transaction
 */
export const calculateFee = (amount: string | number, country?: string): string => {
  // Convert amount to number if it's a string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Base fee calculation (example: 2% + $0.30)
  let fee = numAmount * 0.02 + 0.30;
  
  // Apply country-specific fee adjustments if needed
  if (country === 'CM') {
    // Special rate for Cameroon
    fee = numAmount * 0.025 + 0.25;
  }
  
  // Return formatted fee
  return fee.toFixed(2);
};

/**
 * Calculates total amount (amount + fee)
 */
export const calculateTotal = (amount: string | number, fee: string | number): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const numFee = typeof fee === 'string' ? parseFloat(fee) : fee;
  
  return (numAmount + numFee).toFixed(2);
};

/**
 * Estimates delivery time based on country and payment method
 */
export const getEstimatedDelivery = (country?: string, paymentMethod?: string): string => {
  // Default estimate
  let estimate = 'Within 24 hours';
  
  // Adjust based on country and payment method
  if (country === 'CM') {
    if (paymentMethod === 'mobile_money') {
      estimate = 'Within 15-30 minutes';
    } else if (paymentMethod === 'bank_transfer') {
      estimate = 'Within 1-2 business days';
    }
  } else {
    if (paymentMethod === 'mobile_money') {
      estimate = 'Within 1 hour';
    } else if (paymentMethod === 'bank_transfer') {
      estimate = 'Within 2-3 business days';
    }
  }
  
  return estimate;
};

export default {
  generateTransactionId,
  isValidTransactionId,
  formatTransactionId,
  calculateFee,
  calculateTotal,
  getEstimatedDelivery
};
