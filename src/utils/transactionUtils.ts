
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
