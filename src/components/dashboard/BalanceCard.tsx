
import React from 'react';
import { motion } from 'framer-motion';
import { User, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Transaction } from '@/types/transaction';

interface BalanceCardProps {
  userName: string;
  transactions: Transaction[];
  itemVariants: any;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ 
  userName, 
  transactions,
  itemVariants 
}) => {
  const navigate = useNavigate();
  
  return (
    <motion.div variants={itemVariants} className="mb-6">
      <div className="glass-effect rounded-xl p-6 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-primary-100 text-sm font-medium mb-1">Welcome back</p>
            <h2 className="text-xl font-bold">{userName}</h2>
          </div>
          <div className="bg-white/20 rounded-full p-2">
            <User className="w-5 h-5" />
          </div>
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <p className="text-primary-100 text-sm">Recent Transfer</p>
            <p className="text-2xl font-bold">
              {transactions.length > 0 ? `$${transactions[0].amount}` : '$0'}
            </p>
          </div>
          <button
            onClick={() => navigate('/send')}
            className="bg-white text-primary-500 font-medium py-2 px-4 rounded-lg flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Send Money
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BalanceCard;
