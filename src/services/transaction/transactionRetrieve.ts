import { Transaction, TransactionStatus } from "@/types/transaction";
import { supabase } from "@/integrations/supabase/client";
import { isOffline, addPausedRequest } from "@/utils/networkUtils";
import { mockTransactions } from "@/data/mockTransactions";

// Ensure status is a valid TransactionStatus
const ensureValidStatus = (status: string): TransactionStatus => {
  const validStatuses: TransactionStatus[] = [
    'pending', 'processing', 'completed', 'failed', 
    'offline-pending', 'cancelled', 'refunded'
  ];
  
  return validStatuses.includes(status as TransactionStatus) 
    ? (status as TransactionStatus) 
    : 'pending';
};

// Get user ID from current session
const getUserId = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id || null;
};

// Get all transactions for the current user
export const getTransactions = async (): Promise<Transaction[]> => {
  if (isOffline()) {
    // Get transactions from local storage if offline
    return import("./transactionStore").then(({ getOfflineTransactions }) => {
      return getOfflineTransactions();
    });
  }
  
  try {
    const userId = await getUserId();
    if (!userId) {
      console.error('User not authenticated');
      return [];
    }
    
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    if (!data || data.length === 0) return [];
    
    // Convert database records to Transaction objects
    return data.map(record => ({
      id: record.id,
      amount: record.amount,
      fee: record.fee,
      recipientId: record.recipient_id,
      recipientName: record.recipient_name,
      recipientContact: record.recipient_contact,
      paymentMethod: record.payment_method,
      provider: record.provider,
      country: record.country,
      status: ensureValidStatus(record.status),
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
      completedAt: record.completed_at ? new Date(record.completed_at) : undefined,
      failureReason: record.failure_reason,
      estimatedDelivery: record.estimated_delivery,
      totalAmount: record.total_amount
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    
    // Get local transactions as fallback
    return import("./transactionStore").then(({ getOfflineTransactions }) => {
      return getOfflineTransactions();
    });
  }
};

// Get a single transaction by ID
export const getTransaction = async (id: string): Promise<Transaction | null> => {
  // First check offline storage
  const offlineTransactions = await import("./transactionStore").then(({ getOfflineTransactions }) => {
    return getOfflineTransactions();
  });
  
  const offlineTransaction = offlineTransactions.find(t => t.id === id);
  
  // If found offline and we're offline, return it
  if (offlineTransaction && isOffline()) {
    return offlineTransaction;
  }
  
  // Otherwise try to get from Supabase
  if (!isOffline()) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        // If not found online but found offline, return offline version
        if (offlineTransaction) {
          return offlineTransaction;
        }
        throw error;
      }
      
      if (!data) {
        // If not found online but found offline, return offline version
        if (offlineTransaction) {
          return offlineTransaction;
        }
        return null;
      }
      
      // Convert database record to Transaction object
      return {
        id: data.id,
        amount: data.amount,
        fee: data.fee,
        recipientId: data.recipient_id,
        recipientName: data.recipient_name,
        recipientContact: data.recipient_contact,
        paymentMethod: data.payment_method,
        provider: data.provider,
        country: data.country,
        status: ensureValidStatus(data.status),
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
        failureReason: data.failure_reason,
        estimatedDelivery: data.estimated_delivery,
        totalAmount: data.total_amount
      };
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error);
      
      // For failed API requests, return mock data in development
      if (process.env.NODE_ENV === 'development') {
        const mockTransaction = mockTransactions.find(t => t.id === id);
        return mockTransaction || null;
      }
      
      return null;
    }
  }
  
  // Return offline data if it exists, otherwise null
  return offlineTransaction || null;
};
