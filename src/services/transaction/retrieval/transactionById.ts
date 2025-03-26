
import { Transaction } from '@/types/transaction';
import { supabase } from '@/integrations/supabase/client';
import { getStoredTransactions } from '../transactionStore';
import { normalizeTransaction, mapDatabaseTransactionToModel } from '../utils/transactionMappers';
import { createFallbackTransaction } from '../utils/fallbackTransactions';

/**
 * Get a transaction by ID from all available sources
 */
export const getTransactionById = async (id: string): Promise<Transaction | null> => {
  console.log(`[DEBUG] Fetching transaction with ID: ${id}`);
  
  try {
    // First try localStorage for immediately available data
    const storedTransactions = await getStoredTransactions();
    const storedTransaction = storedTransactions.find(t => t.id === id);
    
    if (storedTransaction) {
      console.log(`[DEBUG] Found transaction in local storage: ${id}`);
      return normalizeTransaction(storedTransaction);
    }
    
    // Check individual localStorage keys that might contain this transaction
    const transactionKeys = [
      `transaction_${id}`,
      `transaction_backup_${id}`,
      `emergency_transaction_${id}`,
      `direct_transaction_${id}`,
      `completed_transaction_${id}`
    ];
    
    for (const key of transactionKeys) {
      const storageData = localStorage.getItem(key);
      if (storageData) {
        try {
          const parsedData = JSON.parse(storageData);
          console.log(`[DEBUG] Found transaction in localStorage key ${key}`);
          return normalizeTransaction(parsedData);
        } catch (e) {
          console.error(`[DEBUG] Error parsing data from ${key}:`, e);
        }
      }
    }
    
    // Then try sessionStorage
    try {
      const sessionData = sessionStorage.getItem(`transaction_session_${id}`);
      if (sessionData) {
        const parsedData = JSON.parse(sessionData);
        console.log(`[DEBUG] Found transaction in sessionStorage`);
        return normalizeTransaction(parsedData);
      }
    } catch (e) {
      console.error('[DEBUG] Error accessing sessionStorage:', e);
    }
    
    // Try to get from Supabase if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      console.log('[DEBUG] User is authenticated, trying Supabase');
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('[DEBUG] Supabase error:', error);
      }
      
      if (data) {
        console.log('[DEBUG] Found transaction in Supabase');
        return mapDatabaseTransactionToModel(data);
      }
    }
    
    // If we're in development and no transaction found, create a fallback
    if (process.env.NODE_ENV === 'development' || window.location.hostname.includes('lovableproject')) {
      console.log('[DEBUG] Creating fallback transaction for development');
      return createFallbackTransaction(id);
    }
    
    console.log('[DEBUG] Transaction not found anywhere');
    return null;
  } catch (error) {
    console.error('[DEBUG] Error retrieving transaction:', error);
    
    // Create fallback transaction on error in development
    if (process.env.NODE_ENV === 'development' || window.location.hostname.includes('lovableproject')) {
      console.log('[DEBUG] Creating fallback transaction after error');
      return createFallbackTransaction(id);
    }
    
    throw error;
  }
};

/**
 * Get a simplified transaction object
 */
export const getTransaction = async (id: string): Promise<Transaction | null> => {
  return getTransactionById(id);
};
