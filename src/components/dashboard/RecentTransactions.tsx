
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRightCircle, SendHorizonal } from 'lucide-react';
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
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">Recent Transactions</h3>
        {transactions.length > 0 && (
          <motion.button
            onClick={() => navigate('/history')}
            className="text-primary text-sm font-medium flex items-center"
            whileHover={{ x: 3 }}
            whileTap={{ x: 0 }}
          >
            View all
            <ArrowRightCircle className="ml-1 w-4 h-4" />
          </motion.button>
        )}
      </div>
      
      {transactions.length === 0 ? (
        <motion.div 
          className="glass-effect rounded-xl p-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-3">No transactions yet</p>
          <motion.button
            onClick={() => navigate('/send')}
            className="bg-primary text-white font-medium px-4 py-2 rounded-lg inline-flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <SendHorizonal className="mr-2 w-4 h-4" />
            Send your first transfer
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: index * 0.1
                  }
                }
              }}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
              }}
              whileTap={{ scale: 0.98 }}
              className="rounded-xl overflow-hidden shadow-sm transition-all duration-200"
            >
              <TransactionCard
                transaction={transaction}
                onClick={() => navigate(`/transaction/${transaction.id}`)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default RecentTransactions;
