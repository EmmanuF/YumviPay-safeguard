
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import TransactionCard from '@/components/TransactionCard';
import { Transaction } from '@/types/transaction';

interface RecentTransactionsProps {
  transactions: Transaction[];
  itemVariants: any;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ 
  transactions,
  itemVariants 
}) => {
  const navigate = useNavigate();
  
  return (
    <motion.div variants={itemVariants}>
      <div className="mb-4">
        <h3 className="text-lg font-medium">Recent Transactions</h3>
      </div>
      
      {transactions.length === 0 ? (
        <div className="glass-effect rounded-xl p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-2">No transactions yet</p>
          <button
            onClick={() => navigate('/send')}
            className="text-primary-500 font-medium"
          >
            Send your first transfer
          </button>
        </div>
      ) : (
        <div>
          {transactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onClick={() => navigate(`/transaction/${transaction.id}`)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default RecentTransactions;
