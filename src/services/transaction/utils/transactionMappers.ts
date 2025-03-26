
import { Transaction } from '@/types/transaction';

/**
 * Map database transaction object to our Transaction model
 */
export const mapDatabaseTransactionToModel = (dbTransaction: any): Transaction => {
  // Ensure we have proper field mappings from snake_case to camelCase
  return {
    id: dbTransaction.id,
    amount: dbTransaction.amount,
    recipientName: dbTransaction.recipient_name || 'Unknown',
    recipientContact: dbTransaction.recipient_contact,
    country: dbTransaction.country,
    status: dbTransaction.status,
    createdAt: new Date(dbTransaction.created_at),
    updatedAt: new Date(dbTransaction.updated_at || dbTransaction.created_at),
    completedAt: dbTransaction.completed_at ? new Date(dbTransaction.completed_at) : undefined,
    estimatedDelivery: dbTransaction.estimated_delivery,
    totalAmount: dbTransaction.total_amount || dbTransaction.amount,
    sendAmount: dbTransaction.amount,
    provider: dbTransaction.provider,
    paymentMethod: dbTransaction.payment_method,
    currency: dbTransaction.currency,
    recipientCountry: dbTransaction.recipient_country || dbTransaction.country,
    recipientCountryCode: dbTransaction.recipient_country_code,
    failureReason: dbTransaction.failure_reason,
    isRecurring: dbTransaction.is_recurring,
    recurringPaymentId: dbTransaction.recurring_payment_id,
    // Add other fields that might be in the DB but not in our model defaults
    date: dbTransaction.created_at,
    type: 'send'
  };
};

/**
 * Normalize transaction data for consistency
 */
export const normalizeTransaction = (transaction: Transaction): Transaction => {
  // Ensure proper date objects
  const createdAt = transaction.createdAt instanceof Date 
    ? transaction.createdAt 
    : new Date(transaction.createdAt);
    
  const updatedAt = transaction.updatedAt instanceof Date 
    ? transaction.updatedAt 
    : transaction.updatedAt 
      ? new Date(transaction.updatedAt) 
      : createdAt;
    
  const completedAt = transaction.completedAt instanceof Date 
    ? transaction.completedAt 
    : transaction.completedAt 
      ? new Date(transaction.completedAt) 
      : transaction.status === 'completed' 
        ? updatedAt 
        : undefined;
  
  // Normalize amount values, ensuring they are numeric
  const amount = typeof transaction.amount === 'string' 
    ? parseFloat(transaction.amount) || 0 
    : transaction.amount || 0;
    
  const totalAmount = typeof transaction.totalAmount === 'string' 
    ? parseFloat(transaction.totalAmount) || amount 
    : transaction.totalAmount || amount;
    
  const sendAmount = typeof transaction.sendAmount === 'string' 
    ? parseFloat(transaction.sendAmount) || amount 
    : transaction.sendAmount || amount;
  
  // Ensure consistent date property
  const date = transaction.date || createdAt.toISOString();
  
  // Ensure transaction has a type property
  const type = transaction.type || 'send';
  
  return {
    ...transaction,
    createdAt,
    updatedAt,
    completedAt,
    amount,
    totalAmount,
    sendAmount,
    date,
    type
  };
};
