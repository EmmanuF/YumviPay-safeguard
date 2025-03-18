
import { supabase } from "@/integrations/supabase/client";
import { getAllTransactions } from "@/services/transaction";
import { formatCurrency } from "@/utils/formatUtils";

// Admin dashboard stats interface
export interface AdminDashboardStats {
  users: number;
  transactions: number;
  transactionVolume: string;
  growth: number;
  alerts: number;
}

// Transaction summary for charts
export interface TransactionSummary {
  name: string;
  transactions: number;
  amount: number;
}

/**
 * Fetch admin dashboard statistics
 */
export const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
  console.log('Fetching admin dashboard stats...');
  
  try {
    // Get user count
    const { count: userCount, error: userError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });
    
    if (userError) throw userError;
    
    // Get transactions
    const transactions = await getAllTransactions();
    
    // Calculate transaction volume
    const totalVolume = transactions.reduce((sum, tx) => {
      const amount = typeof tx.amount === 'string' ? parseFloat(tx.amount) : tx.amount;
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    // Count alerts (failed or pending transactions older than 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const alerts = transactions.filter(tx => {
      const isOld = new Date(tx.createdAt) < oneDayAgo;
      return isOld && (tx.status === 'failed' || tx.status === 'pending');
    }).length;
    
    // Calculate month-over-month growth (simplified mock for now)
    // In a real implementation, you would compare with last month's data
    const growth = (Math.random() * 20 + 10).toFixed(1);
    
    return {
      users: userCount || 0,
      transactions: transactions.length,
      transactionVolume: formatCurrency(totalVolume),
      growth: parseFloat(growth),
      alerts
    };
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    throw error;
  }
}

/**
 * Get monthly transaction summary for charts
 */
export const getTransactionSummaryByMonth = async (months = 6): Promise<TransactionSummary[]> => {
  console.log('Fetching transaction summary by month...');
  
  try {
    const transactions = await getAllTransactions();
    const summary: Record<string, TransactionSummary> = {};
    
    // Get month names
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Get current month and go back 'months' months
    const now = new Date();
    for (let i = 0; i < months; i++) {
      const monthIndex = (now.getMonth() - i + 12) % 12;
      const monthName = monthNames[monthIndex];
      summary[monthName] = {
        name: monthName,
        transactions: 0,
        amount: 0
      };
    }
    
    // Process transactions
    transactions.forEach(tx => {
      const txDate = new Date(tx.createdAt);
      const monthName = monthNames[txDate.getMonth()];
      
      // Only include transactions from the last 'months' months
      const monthsDiff = (now.getFullYear() - txDate.getFullYear()) * 12 + now.getMonth() - txDate.getMonth();
      if (monthsDiff < months && summary[monthName]) {
        summary[monthName].transactions += 1;
        const amount = typeof tx.amount === 'string' ? parseFloat(tx.amount) : tx.amount;
        summary[monthName].amount += (isNaN(amount) ? 0 : amount);
      }
    });
    
    // Convert to array and sort by month order
    const result = Object.values(summary);
    result.sort((a, b) => {
      return monthNames.indexOf(a.name) - monthNames.indexOf(b.name);
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching transaction summary:', error);
    return [];
  }
}

/**
 * Get recent transactions for the admin dashboard
 */
export const getAdminRecentTransactions = async (limit = 5): Promise<any[]> => {
  console.log('Fetching admin recent transactions...');
  
  try {
    const transactions = await getAllTransactions();
    
    // Sort by date (newest first) and limit
    return transactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
      .map(tx => ({
        id: tx.id,
        user: tx.recipientName,  // Using recipient name as a placeholder
        amount: formatCurrency(tx.amount),
        date: new Date(tx.createdAt).toLocaleDateString(),
        status: tx.status
      }));
  } catch (error) {
    console.error('Error fetching admin recent transactions:', error);
    return [];
  }
}

/**
 * Get system status metrics (CPU, memory, etc.)
 * This is a mock implementation since we can't access system metrics directly
 */
export const getSystemStatusMetrics = async (): Promise<any> => {
  // In a real implementation, this would fetch data from a system monitoring service
  return {
    cpu: Math.floor(Math.random() * 30) + 10,
    memory: Math.floor(Math.random() * 40) + 20,
    storage: Math.floor(Math.random() * 50) + 30,
    uptime: "99.9%",
    lastUpdated: new Date().toISOString()
  };
}
