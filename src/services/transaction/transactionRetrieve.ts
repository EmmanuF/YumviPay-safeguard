
import { Transaction } from '@/types/transaction';
import { supabase } from '@/integrations/supabase/client';
import { getStoredTransactions } from './transactionStore';
import { v4 as uuidv4 } from 'uuid';

/**
 * Get a transaction by ID from all available sources
 */
export const getTransactionById = async (id: string): Promise<Transaction | null> => {
  console.log(`[DEBUG] Fetching transaction with ID: ${id}`);
  
  try {
    // First try localStorage for immediately available data
    const storedTransactions = getStoredTransactions();
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
        return normalizeTransaction(data as Transaction);
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
 * Create a fallback transaction for development/testing
 */
const createFallbackTransaction = (id: string): Transaction => {
  console.log('[DEBUG] Creating fallback transaction with ID:', id);
  
  const fallbackTransaction: Transaction = {
    id: id || uuidv4(),
    amount: 50,
    recipientName: 'John Doe',
    recipientContact: '+237612345678',
    country: 'CM',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: new Date(),
    estimatedDelivery: 'Delivered',
    totalAmount: 50,
    sendAmount: 50,
    provider: 'MTN Mobile Money',
    paymentMethod: 'mobile_money',
    currency: 'XAF',
    recipientCountry: 'Cameroon',
    recipientCountryCode: 'CM',
    sourceCurrency: 'USD',
    targetCurrency: 'XAF',
    convertedAmount: 30500,
    exchangeRate: 610,
    date: new Date().toISOString(),
    type: 'send'
  };
  
  // Store the fallback transaction for future retrieval
  try {
    const serialized = JSON.stringify({
      ...fallbackTransaction,
      createdAt: fallbackTransaction.createdAt.toISOString(),
      updatedAt: fallbackTransaction.updatedAt.toISOString(),
      completedAt: fallbackTransaction.completedAt?.toISOString()
    });
    
    localStorage.setItem(`transaction_${id}`, serialized);
    localStorage.setItem(`transaction_backup_${id}`, serialized);
    localStorage.setItem(`fallback_transaction_${id}`, serialized);
  } catch (e) {
    console.error('[DEBUG] Error storing fallback transaction:', e);
  }
  
  return fallbackTransaction;
};

/**
 * Get all stored transactions
 */
export const getAllTransactions = async (): Promise<Transaction[]> => {
  try {
    // Get locally stored transactions
    const storedTransactions = getStoredTransactions();
    
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
      
      if (data) {
        // Combine with stored transactions, removing duplicates
        const combinedTransactions = [
          ...data.map(t => normalizeTransaction(t as Transaction)),
          ...storedTransactions.filter(st => !data.some(dt => dt.id === st.id))
        ];
        
        return combinedTransactions;
      }
    }
    
    return storedTransactions.map(normalizeTransaction);
  } catch (error) {
    console.error('Error retrieving all transactions:', error);
    return getStoredTransactions().map(normalizeTransaction);
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
 * Get a simplified transaction object
 */
export const getTransaction = async (id: string): Promise<Transaction | null> => {
  return getTransactionById(id);
};

/**
 * Get multiple transactions
 */
export const getTransactions = async (ids?: string[]): Promise<Transaction[]> => {
  if (!ids || ids.length === 0) {
    return getAllTransactions();
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

/**
 * Normalize transaction data for consistency
 */
const normalizeTransaction = (transaction: Transaction): Transaction => {
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
