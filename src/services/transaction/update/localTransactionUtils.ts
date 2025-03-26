
import { Transaction, TransactionStatus } from "@/types/transaction";

// Get a transaction from local storage with improved reliability
export const getLocalTransaction = async (transactionId: string): Promise<Transaction | null> => {
  try {
    // First try direct localStorage access
    const transactionKey = `transaction_${transactionId}`;
    const rawStoredTransaction = localStorage.getItem(transactionKey);
    
    if (rawStoredTransaction) {
      try {
        console.log(`Found transaction ${transactionId} in localStorage`);
        const storedTransaction = JSON.parse(rawStoredTransaction);
        return {
          id: storedTransaction.id || storedTransaction.transactionId || transactionId,
          amount: storedTransaction.amount || '0',
          fee: storedTransaction.fee || '0',
          recipientId: storedTransaction.recipientId || '',
          recipientName: storedTransaction.recipientName || 'Recipient',
          recipientContact: storedTransaction.recipientContact || '',
          paymentMethod: storedTransaction.paymentMethod || 'mobile_money',
          provider: storedTransaction.provider || 'MTN Mobile Money',
          country: storedTransaction.country || 'CM',
          status: storedTransaction.status || 'pending',
          createdAt: storedTransaction.createdAt ? new Date(storedTransaction.createdAt) : new Date(),
          updatedAt: storedTransaction.updatedAt ? new Date(storedTransaction.updatedAt) : new Date(),
          completedAt: storedTransaction.completedAt ? new Date(storedTransaction.completedAt) : undefined,
          failureReason: storedTransaction.failureReason,
          estimatedDelivery: storedTransaction.estimatedDelivery || 'Processing',
          totalAmount: storedTransaction.totalAmount || storedTransaction.amount || '0'
        };
      } catch (parseError) {
        console.error(`Error parsing stored transaction ${transactionId}:`, parseError);
      }
    }
    
    // If not found in localStorage, try the offline store
    try {
      const { getOfflineTransactions } = await import('../store');
      
      const transactions = getOfflineTransactions();
      const transaction = transactions.find(t => t.id === transactionId);
      
      if (transaction) {
        console.log(`Found transaction ${transactionId} in offline storage`);
        return transaction;
      }
    } catch (offlineError) {
      console.error(`Error accessing offline storage for ${transactionId}:`, offlineError);
    }
    
    console.warn(`Transaction ${transactionId} not found in any local storage`);
    return null;
  } catch (error) {
    console.error(`Error retrieving transaction ${transactionId} from local storage:`, error);
    return null;
  }
};

// Update a transaction in local storage with better error handling
export const updateLocalTransaction = async (
  transactionId: string,
  status: TransactionStatus,
  options?: {
    completedAt?: Date;
    failureReason?: string;
  }
): Promise<boolean> => {
  try {
    // First check direct localStorage access
    const transactionKey = `transaction_${transactionId}`;
    const rawStoredTransaction = localStorage.getItem(transactionKey);
    
    if (rawStoredTransaction) {
      try {
        const storedTransaction = JSON.parse(rawStoredTransaction);
        const updatedTransaction = {
          ...storedTransaction,
          status,
          updatedAt: new Date().toISOString(),
          ...(options?.completedAt && { completedAt: options.completedAt.toISOString() }),
          ...(options?.failureReason && { failureReason: options.failureReason })
        };
        
        // Update in localStorage
        localStorage.setItem(transactionKey, JSON.stringify(updatedTransaction));
        console.log(`Transaction ${transactionId} updated in localStorage directly`);
        
        // Double-check that the update succeeded
        const verifyUpdate = localStorage.getItem(transactionKey);
        if (!verifyUpdate) {
          console.error(`CRITICAL ERROR: Failed to verify localStorage update for ${transactionId}`);
          return false;
        }
        
        try {
          // Also update in the offline store
          const { getOfflineTransactions, setOfflineTransactions } = await import('../store');
          const transactions = getOfflineTransactions();
          const index = transactions.findIndex(t => t.id === transactionId);
          
          if (index >= 0) {
            const offlineTransaction = {
              ...transactions[index],
              status,
              updatedAt: new Date(),
              ...(options?.completedAt && { completedAt: options.completedAt }),
              ...(options?.failureReason && { failureReason: options.failureReason })
            };
            
            transactions[index] = offlineTransaction;
            setOfflineTransactions([...transactions]);
            console.log(`Transaction ${transactionId} also updated in offline storage`);
          }
        } catch (offlineError) {
          // Non-critical error, continue since localStorage update succeeded
          console.error(`Error updating offline storage for ${transactionId}:`, offlineError);
        }
        
        return true;
      } catch (parseError) {
        console.error(`Error parsing stored transaction ${transactionId}:`, parseError);
        
        // Try to fix corrupted data
        try {
          // Create a minimum valid transaction JSON
          const basicTransaction = {
            id: transactionId,
            status,
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            ...(options?.completedAt && { completedAt: options.completedAt.toISOString() }),
            ...(options?.failureReason && { failureReason: options.failureReason })
          };
          
          localStorage.setItem(transactionKey, JSON.stringify(basicTransaction));
          console.log(`Created repair transaction in localStorage for ${transactionId}`);
          return true;
        } catch (repairError) {
          console.error(`Failed to repair localStorage for ${transactionId}:`, repairError);
        }
      }
    }
    
    // If direct localStorage access failed, try the offline store
    try {
      const { getOfflineTransactions, setOfflineTransactions } = await import('../store');
      
      const transactions = getOfflineTransactions();
      const index = transactions.findIndex(t => t.id === transactionId);
      
      if (index >= 0) {
        const updatedTransaction = {
          ...transactions[index],
          status,
          updatedAt: new Date(),
          ...(options?.completedAt && { completedAt: options.completedAt }),
          ...(options?.failureReason && { failureReason: options.failureReason })
        };
        
        transactions[index] = updatedTransaction;
        setOfflineTransactions([...transactions]);
        
        // Also update in localStorage for redundancy
        localStorage.setItem(transactionKey, JSON.stringify({
          ...updatedTransaction,
          updatedAt: updatedTransaction.updatedAt.toISOString(),
          createdAt: updatedTransaction.createdAt.toISOString(),
          ...(updatedTransaction.completedAt && { completedAt: updatedTransaction.completedAt.toISOString() })
        }));
        
        console.log(`Transaction ${transactionId} updated in offline storage and localStorage`);
        return true;
      }
    } catch (offlineStoreError) {
      console.error(`Error accessing offline store for ${transactionId}:`, offlineStoreError);
    }
    
    // If transaction doesn't exist in any storage, create a new one
    console.log(`Transaction ${transactionId} not found in storage, creating new entry`);
    const newTransaction = {
      id: transactionId,
      status,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ...(options?.completedAt && { completedAt: options.completedAt.toISOString() }),
      ...(options?.failureReason && { failureReason: options.failureReason }),
      amount: '0',
      recipientName: 'Unknown',
      country: 'CM',
      paymentMethod: 'mobile_money',
      provider: 'MTN Mobile Money',
      estimatedDelivery: status === 'completed' ? 'Delivered' : 'Processing',
      totalAmount: '0'
    };
    
    localStorage.setItem(transactionKey, JSON.stringify(newTransaction));
    console.log(`Created new transaction in localStorage for ${transactionId}`);
    return true;
  } catch (error) {
    console.error(`Critical error updating transaction ${transactionId} in local storage:`, error);
    return false;
  }
};
