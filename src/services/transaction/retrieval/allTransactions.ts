
import { Transaction } from '@/types/transaction';
import { supabase } from '@/integrations/supabase/client';
import { getStoredTransactions } from '../store';
import { normalizeTransaction, mapDatabaseTransactionToModel } from '../utils/transactionMappers';

/**
 * Get all stored transactions
 */
export const getAllTransactions = async (): Promise<Transaction[]> => {
  try {
    // Get locally stored transactions
    const storedTransactions = await getStoredTransactions();
    
    // Try to get from Supabase if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('createdAt', { ascending: false });
        
      if (error) {
        console.error('Error fetching transactions from Supabase:', error);
      }
      
      if (data && Array.isArray(data)) {
        // Combine with stored transactions, removing duplicates
        const dbTransactions = data.map(t => mapDatabaseTransactionToModel(t));
        const combinedTransactions = [
          ...dbTransactions,
          ...storedTransactions.filter(st => !data.some(dt => dt.id === st.id))
        ];
        
        return combinedTransactions;
      }
    }
    
    return storedTransactions.map(normalizeTransaction);
  } catch (error) {
    console.error('Error retrieving all transactions:', error);
    return (await getStoredTransactions()).map(normalizeTransaction);
  }
};

/**
 * Get recent transactions (last 5)
 */
export const getRecentTransactions = async (): Promise<Transaction[]> => {
  try {
    const transactions = await getAllTransactions();
    return transactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(normalizeTransaction);
  } catch (error) {
    console.error('Error retrieving recent transactions:', error);
    return [];
  }
};

/**
 * Get multiple transactions
 */
export const getTransactions = async (ids?: string[]): Promise<Transaction[]> => {
  if (!ids || ids.length === 0) {
    return await getAllTransactions();
  }
  
  try {
    const transactions = await getAllTransactions();
    return transactions
      .filter(t => ids.includes(t.id))
      .map(normalizeTransaction);
  } catch (error) {
    console.error('Error retrieving transactions by IDs:', error);
    return [];
  }
};
