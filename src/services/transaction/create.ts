
import { supabase } from '@/integrations/supabase/client';
import type { Transaction, TransactionStatus } from '@/types/transaction';
import { getReliableAmount } from '@/utils/transactionAmountUtils';

/**
 * Create a new transaction
 * @param transaction Transaction data to create
 * @returns Created transaction
 */
export const createTransaction = async (transaction: Partial<Transaction>): Promise<Transaction | null> => {
  try {
    console.log('Creating transaction:', transaction);
    
    // For local transactions (not stored in Supabase yet), just store in localStorage
    if (transaction.id && transaction.id.startsWith('TXN-')) {
      // Create a fully-formed Transaction object
      const localTransaction: Transaction = {
        id: transaction.id,
        amount: transaction.amount?.toString() || '0',
        recipientName: transaction.recipientName || 'Unknown',
        country: transaction.country || 'CM',
        status: transaction.status || 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        // Include other optional fields
        recipientContact: transaction.recipientContact,
        paymentMethod: transaction.paymentMethod,
        provider: transaction.provider,
        estimatedDelivery: transaction.estimatedDelivery || 'Processing',
        totalAmount: transaction.totalAmount?.toString() || transaction.amount?.toString() || '0',
        convertedAmount: transaction.convertedAmount,
        exchangeRate: transaction.exchangeRate,
        sourceCurrency: transaction.sourceCurrency,
        targetCurrency: transaction.targetCurrency
      };
      
      // Store in localStorage
      localStorage.setItem(`transaction_${transaction.id}`, JSON.stringify(localTransaction));
      console.log('Saved local transaction:', localTransaction);
      
      return localTransaction;
    }
    
    // Get authenticated user
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    // If no user ID is available and we're trying to use Supabase, switch to local storage
    if (!userId) {
      console.log('No authenticated user, creating local transaction instead');
      const localId = transaction.id || `local-${Date.now()}`;
      
      // Ensure the status is a valid TransactionStatus type
      const status: TransactionStatus = transaction.status as TransactionStatus || 'pending';
      
      const localTransaction: Transaction = {
        id: localId,
        amount: transaction.amount?.toString() || '0',
        recipientName: transaction.recipientName || 'Unknown',
        country: transaction.country || 'CM',
        status: status,
        createdAt: new Date(),
        updatedAt: new Date(),
        recipientContact: transaction.recipientContact,
        paymentMethod: transaction.paymentMethod,
        provider: transaction.provider
      };
      
      localStorage.setItem(`transaction_${localId}`, JSON.stringify(localTransaction));
      return localTransaction;
    }
    
    // Default values for required fields if not provided for Supabase insertion
    const transactionData = {
      status: transaction.status || 'pending',
      // Supabase expects snake_case
      recipient_name: transaction.recipientName,
      recipient_contact: transaction.recipientContact,
      country: transaction.country,
      amount: typeof transaction.amount === 'number' ? transaction.amount.toString() : transaction.amount,
      payment_method: transaction.paymentMethod,
      provider: transaction.provider,
      user_id: userId, // Add the required user_id field
      // You can add other fields as needed
      id: transaction.id // Only if provided
    };
    
    // Create the transaction in the database
    const { data, error } = await supabase
      .from('transactions')
      .insert(transactionData)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating transaction:', error);
      
      // Fall back to local storage for offline usage
      // Ensure status is a valid TransactionStatus
      const validStatus: TransactionStatus = (transaction.status as TransactionStatus) || 'pending';
      
      const localTransaction: Transaction = {
        id: transaction.id || `local-${Date.now()}`,
        amount: transaction.amount?.toString() || '0',
        recipientName: transaction.recipientName || 'Unknown',
        country: transaction.country || 'CM',
        status: validStatus,
        createdAt: new Date(),
        // Include other fields
        recipientContact: transaction.recipientContact,
        paymentMethod: transaction.paymentMethod,
        provider: transaction.provider
      };
      
      localStorage.setItem(`transaction_${localTransaction.id}`, JSON.stringify(localTransaction));
      console.log('Saved transaction to local storage:', localTransaction);
      
      return localTransaction;
    }
    
    // Convert database response to Transaction type
    const createdTransaction: Transaction = {
      id: data.id,
      amount: data.amount,
      recipientName: data.recipient_name,
      country: data.country,
      status: data.status as TransactionStatus,
      createdAt: new Date(data.created_at),
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
      // Include other fields
      recipientContact: data.recipient_contact,
      paymentMethod: data.payment_method,
      provider: data.provider,
      estimatedDelivery: data.estimated_delivery,
      totalAmount: data.total_amount
    };
    
    console.log('Transaction created successfully:', createdTransaction);
    return createdTransaction;
  } catch (error) {
    console.error('Error in createTransaction:', error);
    
    // Emergency fallback
    const fallbackTransaction: Transaction = {
      id: transaction.id || `emergency-${Date.now()}`,
      amount: transaction.amount?.toString() || '0',
      recipientName: transaction.recipientName || 'Unknown',
      country: transaction.country || 'CM',
      status: 'pending',
      createdAt: new Date(),
      // Include other optional fields if available
      recipientContact: transaction.recipientContact,
      paymentMethod: transaction.paymentMethod,
      provider: transaction.provider
    };
    
    localStorage.setItem(`transaction_${fallbackTransaction.id}`, JSON.stringify(fallbackTransaction));
    console.log('Emergency fallback: Saved to localStorage:', fallbackTransaction);
    
    return fallbackTransaction;
  }
};
