
import { Transaction } from '@/types/transaction';

/**
 * Normalize a transaction to ensure all required fields are present and of the correct type
 */
export const normalizeTransaction = (transaction: any): Transaction => {
  // Ensure createdAt and updatedAt are Date objects
  const createdAt = transaction.createdAt 
    ? (transaction.createdAt instanceof Date 
        ? transaction.createdAt 
        : new Date(transaction.createdAt))
    : new Date();
    
  const updatedAt = transaction.updatedAt
    ? (transaction.updatedAt instanceof Date
        ? transaction.updatedAt
        : new Date(transaction.updatedAt))
    : new Date();
    
  const completedAt = transaction.completedAt
    ? (transaction.completedAt instanceof Date
        ? transaction.completedAt
        : new Date(transaction.completedAt))
    : undefined;
  
  // Ensure required fields have default values
  return {
    id: transaction.id,
    amount: transaction.amount || '0',
    recipientName: transaction.recipientName || 'Unknown Recipient',
    country: transaction.country || 'CM',
    status: transaction.status || 'pending',
    createdAt,
    updatedAt,
    completedAt,
    // Include all other fields with fallbacks
    recipientContact: transaction.recipientContact || transaction.recipient,
    recipientId: transaction.recipientId,
    estimatedDelivery: transaction.estimatedDelivery || 'Processing',
    totalAmount: transaction.totalAmount || transaction.amount || '0',
    fee: transaction.fee || '0',
    paymentMethod: transaction.paymentMethod,
    provider: transaction.provider,
    // Exchange rate fields
    sourceCurrency: transaction.sourceCurrency || 'USD',
    targetCurrency: transaction.targetCurrency || 'XAF',
    convertedAmount: transaction.convertedAmount,
    exchangeRate: transaction.exchangeRate,
    // Additional fields
    isRecurring: transaction.isRecurring || false,
    recurringPaymentId: transaction.recurringPaymentId,
    customFields: transaction.customFields
  };
};

/**
 * Map a database transaction record to a Transaction model
 */
export const mapDatabaseTransactionToModel = (dbTransaction: any): Transaction => {
  return normalizeTransaction({
    id: dbTransaction.id,
    amount: dbTransaction.amount,
    recipientName: dbTransaction.recipient_name,
    recipientContact: dbTransaction.recipient_contact,
    recipientId: dbTransaction.recipient_id,
    country: dbTransaction.country,
    status: dbTransaction.status,
    createdAt: dbTransaction.created_at,
    updatedAt: dbTransaction.updated_at,
    completedAt: dbTransaction.completed_at,
    estimatedDelivery: dbTransaction.estimated_delivery,
    totalAmount: dbTransaction.total_amount,
    fee: dbTransaction.fee,
    paymentMethod: dbTransaction.payment_method,
    provider: dbTransaction.provider,
    sourceCurrency: dbTransaction.source_currency,
    targetCurrency: dbTransaction.target_currency,
    convertedAmount: dbTransaction.converted_amount,
    exchangeRate: dbTransaction.exchange_rate,
    isRecurring: dbTransaction.is_recurring,
    recurringPaymentId: dbTransaction.recurring_payment_id,
    customFields: dbTransaction.custom_fields
  });
};
