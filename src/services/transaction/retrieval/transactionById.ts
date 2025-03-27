
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
    // Attempt direct transaction retrieval from localStorage first (most reliable)
    try {
      const directKeys = [
        `transaction_${id}`,
        `transaction_backup_${id}`,
        `emergency_transaction_${id}`,
        `completed_transaction_${id}`,
        `direct_transaction_${id}`
      ];
      
      for (const key of directKeys) {
        const storedData = localStorage.getItem(key);
        if (storedData) {
          console.log(`[Transaction Retrieval] Found transaction in localStorage key: ${key}`);
          try {
            const parsedData = JSON.parse(storedData);
            
            // Convert date strings to Date objects
            return {
              ...parsedData,
              createdAt: new Date(parsedData.createdAt),
              updatedAt: new Date(parsedData.updatedAt),
              completedAt: parsedData.completedAt ? new Date(parsedData.completedAt) : undefined
            };
          } catch (e) {
            console.error(`[Transaction Retrieval] Error parsing data from ${key}:`, e);
          }
        }
      }
    } catch (e) {
      console.error('[Transaction Retrieval] Error accessing localStorage:', e);
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
    
    // Try checking window.__EMERGENCY_TRANSACTION for TXN-prefixed IDs
    if (id.startsWith('TXN-')) {
      try {
        // @ts-ignore - Emergency data access
        const emergencyData = window.__EMERGENCY_TRANSACTION;
        if (emergencyData) {
          try {
            const parsedData = JSON.parse(emergencyData);
            if (parsedData.id === id) {
              console.log('[Transaction Retrieval] Found transaction in window.__EMERGENCY_TRANSACTION');
              return normalizeTransaction(parsedData);
            }
          } catch (e) {
            console.error('[Transaction Retrieval] Error parsing window.__EMERGENCY_TRANSACTION:', e);
          }
        }
      } catch (e) {
        console.error('[Transaction Retrieval] Error accessing window.__EMERGENCY_TRANSACTION:', e);
      }
    }
    
    // If not found in direct storage, try the transaction store
    console.log('[Transaction Retrieval] Checking transaction store...');
    const storedTransactions = await getStoredTransactions();
    const storedTransaction = storedTransactions.find(t => t.id === id);
    
    if (storedTransaction) {
      console.log(`[Transaction Retrieval] Found transaction in transaction store: ${id}`);
      return normalizeTransaction(storedTransaction);
    }
    
    // If not found, create a fallback transaction
    console.log('[Transaction Retrieval] Transaction not found, creating fallback');
    const fallback = createFallbackTransaction(id);
    
    return fallback;
  } catch (error) {
    console.error('[Transaction Retrieval] Error retrieving transaction:', error);
    
    // Create fallback transaction on error
    const fallback = createFallbackTransaction(id);
    return fallback;
  }
};

/**
 * Get a simplified transaction object
 */
export const getTransaction = async (id: string): Promise<Transaction | null> => {
  return getTransactionById(id);
};
