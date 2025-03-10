
import React from 'react';
import { motion } from 'framer-motion';
import { Transaction } from '@/types/transaction';
import { Separator } from '@/components/ui/separator';
import TransactionCard from '@/components/TransactionCard';

interface TransactionGroupProps {
  date: string;
  transactions: Transaction[];
  onTransactionClick: (transactionId: string) => void;
}

const TransactionGroup: React.FC<TransactionGroupProps> = ({ 
  date, 
  transactions, 
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

  return (
    <motion.div variants={itemVariants}>
      <div className="mb-2 mt-4">
        <h3 className="text-sm font-medium text-gray-500">
          {new Date(date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h3>
        <Separator className="mt-1" />
      </div>
      
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          onClick={() => onTransactionClick(transaction.id)}
        />
      ))}
    </motion.div>
  );
};

export default TransactionGroup;
