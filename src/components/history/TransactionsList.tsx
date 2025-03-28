
import React from 'react';
import { motion } from 'framer-motion';
import { Transaction } from '@/types/transaction';
import { Card, CardContent } from '@/components/ui/card';
import TransactionGroup from './TransactionGroup';
import { useIsMobile } from '@/hooks/use-mobile';
import { ClipboardList } from 'lucide-react';

interface TransactionsListProps {
  isLoading: boolean;
  filteredTransactions: Transaction[];
  transactions?: Transaction[]; // For backward compatibility
  error?: any; // For backward compatibility
  onRefresh?: () => Promise<void>; // For backward compatibility
  onTransactionClick: (transactionId: string) => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ 
  isLoading, 
  filteredTransactions, 
  transactions, // For backward compatibility
  onTransactionClick 
}) => {
  const isMobile = useIsMobile();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };
  
  const itemVariants = {
    hidden: { 
      y: 20, 
      opacity: 0,
      scale: 0.98
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // For backward compatibility with existing usage
  const dataToUse = filteredTransactions || transactions || [];

  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const groups: Record<string, Transaction[]> = {};
    
    transactions.forEach(transaction => {
      // Use date property if available, otherwise fallback to createdAt
      const dateObj = transaction.date ? new Date(transaction.date) : transaction.createdAt;
      const dateStr = dateObj.toDateString();
      
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      
      groups[dateStr].push(transaction);
    });
    
    return Object.entries(groups)
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .map(([date, transactions]) => ({
        date,
        transactions,
      }));
  };
  
  const groupedTransactions = groupTransactionsByDate(dataToUse);

  if (isLoading) {
    return (
      <motion.div 
        variants={itemVariants} 
        className="text-center py-8"
        initial="hidden"
        animate="visible"
      >
        <div className="glass-effect rounded-xl p-6 animate-pulse-subtle">
          <div className="w-48 h-6 bg-primary-100/50 rounded-md mx-auto"></div>
          <div className="mt-4 w-full h-12 bg-primary-100/30 rounded-md"></div>
          <div className="mt-2 w-full h-12 bg-primary-100/30 rounded-md"></div>
          <div className="mt-2 w-full h-12 bg-primary-100/30 rounded-md"></div>
        </div>
      </motion.div>
    );
  }
  
  if (dataToUse.length === 0) {
    return (
      <motion.div 
        variants={itemVariants} 
        className="text-center py-8"
        initial="hidden"
        animate="visible"
      >
        <Card className="glass-effect border-0 shadow-sm">
          <CardContent className="pt-6 pb-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ClipboardList className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-muted-foreground">No transactions found</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {groupedTransactions.map((group) => (
        <TransactionGroup
          key={group.date}
          date={group.date}
          transactions={group.transactions}
          onTransactionClick={onTransactionClick}
        />
      ))}
    </motion.div>
  );
};

export default TransactionsList;
