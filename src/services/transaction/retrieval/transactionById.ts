
import { Transaction } from '@/types/transaction';
import { supabase } from '@/integrations/supabase/client';
import { getStoredTransactions } from '../store';
import { normalizeTransaction, mapDatabaseTransactionToModel } from '../utils/transactionMappers';
import { createFallbackTransaction } from '../utils/fallbackTransactions';

/**
 * Get a transaction by ID from all available sources
 */
export const getTransactionById = async (id: string): Promise<Transaction | null> => {
  console.log(`[Transaction Retrieval] Fetching transaction with ID: ${id}`);
  
  try {
    // First check localStorage directly for the transaction
    const directTransactionKey = `transaction_${id}`;
    const backupTransactionKey = `transaction_backup_${id}`;
    const emergencyTransactionKey = `emergency_transaction_${id}`;
    const completedTransactionKey = `completed_transaction_${id}`;
    
    // Try all possible storage keys for this transaction
    const possibleKeys = [
      directTransactionKey,
      backupTransactionKey,
      emergencyTransactionKey,
      completedTransactionKey,
      `direct_transaction_${id}`
    ];
    
    // Check all possible keys
    for (const key of possibleKeys) {
      try {
        const storedData = localStorage.getItem(key);
        if (storedData) {
          console.log(`[Transaction Retrieval] Found transaction in localStorage key: ${key}`);
          const parsedData = JSON.parse(storedData);
          
          // Make sure dates are properly handled
          return {
            ...parsedData,
            createdAt: parsedData.createdAt ? new Date(parsedData.createdAt) : new Date(),
            updatedAt: parsedData.updatedAt ? new Date(parsedData.updatedAt) : new Date(),
            completedAt: parsedData.completedAt ? new Date(parsedData.completedAt) : undefined
          };
        }
      } catch (e) {
        console.error(`[Transaction Retrieval] Error accessing key ${key}:`, e);
      }
    }
    
    // Try sessionStorage next
    try {
      const sessionData = sessionStorage.getItem(`transaction_session_${id}`);
      if (sessionData) {
        console.log('[Transaction Retrieval] Found transaction in sessionStorage');
        const parsedData = JSON.parse(sessionData);
        return normalizeTransaction(parsedData);
      }
    } catch (e) {
      console.error('[Transaction Retrieval] Error accessing sessionStorage:', e);
    }
    
    // If not found in direct storage, try the transaction store
    const storedTransactions = await getStoredTransactions();
    const storedTransaction = storedTransactions.find(t => t.id === id);
    
    if (storedTransaction) {
      console.log(`[Transaction Retrieval] Found transaction in transaction store: ${id}`);
      return normalizeTransaction(storedTransaction);
    }
    
    // If still not found and in dev/test environment, create a fallback
    if (process.env.NODE_ENV === 'development' || window.location.hostname.includes('lovableproject')) {
      console.log('[Transaction Retrieval] Creating fallback transaction for development');
      const fallback = createFallbackTransaction(id);
      
      // Store the fallback for future retrievals
      try {
        localStorage.setItem(directTransactionKey, JSON.stringify({
          ...fallback,
          createdAt: fallback.createdAt.toISOString(),
          updatedAt: fallback.updatedAt.toISOString(),
          completedAt: fallback.completedAt ? fallback.completedAt.toISOString() : undefined
        }));
      } catch (e) {
        console.error('[Transaction Retrieval] Error storing fallback transaction:', e);
      }
      
      return fallback;
    }
    
    console.log('[Transaction Retrieval] Transaction not found anywhere');
    return null;
  } catch (error) {
    console.error('[Transaction Retrieval] Error retrieving transaction:', error);
    
    // Create fallback transaction on error in development
    if (process.env.NODE_ENV === 'development' || window.location.hostname.includes('lovableproject')) {
      const fallback = createFallbackTransaction(id);
      return fallback;
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
