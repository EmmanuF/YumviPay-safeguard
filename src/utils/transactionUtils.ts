
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

export default {
  generateTransactionId,
  isValidTransactionId,
  formatTransactionId
};
