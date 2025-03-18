
import { Transaction } from "@/types/transaction";
import { getAllTransactions, updateTransactionStatus } from "@/services/transaction";
import { formatCurrency } from "@/utils/formatUtils";

export interface AdminTransaction {
  id: string;
  user: string;
  amount: string;
  currency: string;
  recipient: string;
  country: string;
  status: string;
  date: string;
  rawTransaction: Transaction;
}

/**
 * Get all transactions for admin view
 */
export const getAdminTransactions = async (): Promise<AdminTransaction[]> => {
  console.log('Fetching admin transactions...');
  
  try {
    const transactions = await getAllTransactions();
    
    return transactions.map(tx => ({
      id: tx.id,
      user: "User", // In a real app, you would look up the user name
      amount: typeof tx.amount === 'string' ? tx.amount : tx.amount.toString(),
      currency: tx.currency || 'USD',
      recipient: tx.recipientName,
      country: tx.country,
      status: tx.status,
      date: tx.createdAt.toString(),
      rawTransaction: tx
    }));
  } catch (error) {
    console.error('Error fetching admin transactions:', error);
    return [];
  }
};

/**
 * Update transaction status for admin
 */
export const adminUpdateTransactionStatus = async (
  id: string, 
  status: string, 
  options?: { 
    completedAt?: Date; 
    failureReason?: string; 
  }
): Promise<boolean> => {
  try {
    const result = await updateTransactionStatus(id, status as any, options);
    return !!result;
  } catch (error) {
    console.error('Error updating transaction status:', error);
    return false;
  }
};

/**
 * Get transaction statistics
 */
export const getTransactionStatistics = async () => {
  const transactions = await getAllTransactions();
  
  // Calculate total volume
  const totalVolume = transactions.reduce((sum, tx) => {
    const amount = typeof tx.amount === 'string' ? parseFloat(tx.amount) : tx.amount;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  
  // Count by status
  const statusCounts: Record<string, number> = {};
  transactions.forEach(tx => {
    statusCounts[tx.status] = (statusCounts[tx.status] || 0) + 1;
  });
  
  // Count by country
  const countryCounts: Record<string, number> = {};
  transactions.forEach(tx => {
    countryCounts[tx.country] = (countryCounts[tx.country] || 0) + 1;
  });
  
  return {
    totalCount: transactions.length,
    totalVolume: formatCurrency(totalVolume),
    byStatus: statusCounts,
    byCountry: countryCounts
  };
};
