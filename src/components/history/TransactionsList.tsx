
import React from 'react';
import { motion } from 'framer-motion';
import { Transaction } from '@/types/transaction';
import { Card, CardContent } from '@/components/ui/card';
import TransactionGroup from './TransactionGroup';

interface TransactionsListProps {
  isLoading: boolean;
  filteredTransactions: Transaction[];
  transactions?: Transaction[]; // Added for backward compatibility
  error?: any; // Added for backward compatibility
  onRefresh?: () => Promise<void>; // Added for backward compatibility
  onTransactionClick: (transactionId: string) => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ 
  isLoading, 
  filteredTransactions, 
  transactions, // For backward compatibility
  onTransactionClick 
}) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
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
      const dateStr = transaction.date ? new Date(transaction.date).toDateString() : 
                       transaction.createdAt.toDateString();
      
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      
      groups[dateStr].push(transaction);
    });
    
    return Object.entries(groups).map(([date, transactions]) => ({
      date,
      transactions,
    }));
  };
  
  const groupedTransactions = groupTransactionsByDate(dataToUse);

  if (isLoading) {
    return (
      <motion.div variants={itemVariants} className="text-center py-8">
        <div className="animate-pulse-subtle">Loading transactions...</div>
      </motion.div>
    );
  }
  
  if (dataToUse.length === 0) {
    return (
      <motion.div variants={itemVariants} className="text-center py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No transactions found</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  return (
    <div>
      {groupedTransactions.map((group) => (
        <TransactionGroup
          key={group.date}
          date={group.date}
          transactions={group.transactions}
          onTransactionClick={onTransactionClick}
        />
      ))}
    </div>
  );
};

export default TransactionsList;
