
import { supabase } from '@/integrations/supabase/client';
import type { Transaction } from '@/types/transaction';

/**
 * Create a new transaction
 * @param transaction Transaction data to create
 * @returns Created transaction
 */
export const createTransaction = async (transaction: Partial<Transaction>): Promise<Transaction | null> => {
  try {
    console.log('Creating transaction:', transaction);
    
    // Default values for required fields if not provided
    const transactionData = {
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...transaction
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
      const localTransaction = {
        ...transactionData,
        id: transaction.id || `local-${Date.now()}`,
      };
      
      localStorage.setItem(`transaction_${localTransaction.id}`, JSON.stringify(localTransaction));
      console.log('Saved transaction to local storage:', localTransaction);
      
      return localTransaction as Transaction;
    }
    
    console.log('Transaction created successfully:', data);
    return data as Transaction;
  } catch (error) {
    console.error('Error in createTransaction:', error);
    
    // Emergency fallback
    const fallbackTransaction = {
      id: transaction.id || `emergency-${Date.now()}`,
      amount: transaction.amount || '0',
      recipientName: transaction.recipientName || 'Unknown',
      country: transaction.country || 'CM',
      status: 'pending',
      createdAt: new Date(),
      ...transaction
    } as Transaction;
    
    localStorage.setItem(`transaction_${fallbackTransaction.id}`, JSON.stringify(fallbackTransaction));
    console.log('Emergency fallback: Saved to localStorage:', fallbackTransaction);
    
    return fallbackTransaction;
  }
};
