
import { Transaction } from "@/types/transaction";
import { supabase } from "@/integrations/supabase/client";
import { useNetwork } from "@/contexts/NetworkContext";

// Get transaction by ID
export const getTransactionById = (id: string): Transaction | undefined => {
  // First check local cache
  const { getOfflineTransactions } = require("./transactionStore");
  const localTransaction = getOfflineTransactions().find(t => t.id === id);
  if (localTransaction) {
    return localTransaction;
  }
  
  // If not found locally but we're online, try to get from Supabase
  // but return undefined while waiting for API
  const { isOffline } = useNetwork();
  if (!isOffline) {
    supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        // Add to local cache if found
        if (data && !error) {
          const transaction: Transaction = {
            id: data.id,
            amount: data.amount,
            fee: data.fee,
            recipientId: data.recipient_id,
            recipientName: data.recipient_name,
            recipientContact: data.recipient_contact,
            paymentMethod: data.payment_method,
            provider: data.provider,
            country: data.country,
            status: data.status,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
            completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
            failureReason: data.failure_reason,
            estimatedDelivery: data.estimated_delivery,
            totalAmount: data.total_amount
          };
          
          const { getOfflineTransactions, setOfflineTransactions } = require("./transactionStore");
          const offlineTransactions = getOfflineTransactions();
          if (!offlineTransactions.some(t => t.id === transaction.id)) {
            setOfflineTransactions([...offlineTransactions, transaction]);
          }
        }
      })
      .catch(error => {
        console.error('Error fetching transaction from Supabase:', error);
      });
  }
  
  return undefined;
};

// Get all transactions
export const getAllTransactions = (): Transaction[] => {
  const { isOffline } = useNetwork();
  const { getOfflineTransactions, setOfflineTransactions } = require("./transactionStore");
  
  // Start API fetch if online, but don't wait for response
  if (!isOffline) {
    supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (data && !error) {
          // Convert to Transaction objects
          const transactions: Transaction[] = data.map(item => ({
            id: item.id,
            amount: item.amount,
            fee: item.fee,
            recipientId: item.recipient_id,
            recipientName: item.recipient_name,
            recipientContact: item.recipient_contact,
            paymentMethod: item.payment_method,
            provider: item.provider,
            country: item.country,
            status: item.status,
            createdAt: new Date(item.created_at),
            updatedAt: new Date(item.updated_at),
            completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
            failureReason: item.failure_reason,
            estimatedDelivery: item.estimated_delivery,
            totalAmount: item.total_amount
          }));
          
          // Update local cache with latest data
          setOfflineTransactions(transactions);
        }
      })
      .catch(error => {
        console.error('Error fetching transactions from Supabase:', error);
      });
  }
  
  // Return cached transactions immediately
  return [...getOfflineTransactions()].sort((a, b) => 
    b.createdAt.getTime() - a.createdAt.getTime()
  );
};

// Get recent transactions (limited count)
export const getRecentTransactions = (limit: number = 5): Transaction[] => {
  const transactions = getAllTransactions();
  return transactions.slice(0, limit);
};
