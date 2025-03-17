
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
      <div className="rounded-xl p-6 bg-primary-gradient text-white shadow-lg relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-white/5 blur-lg"></div>
        
        <div className="flex justify-between items-start mb-6 relative">
          <div>
            <p className="text-primary-100 text-sm font-medium mb-1">Welcome back</p>
            <h2 className="text-xl font-bold">{userName}</h2>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/20 rounded-full p-2 backdrop-blur-sm"
          >
            <User className="w-5 h-5" />
          </motion.div>
        </div>
        
        <div className="flex justify-between items-end relative">
          <div>
            <p className="text-primary-100 text-sm">Recent Transfer</p>
            <p className="text-2xl font-bold">
              {transactions.length > 0 ? `$${transactions[0].amount}` : '$0'}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/send')}
            className="bg-white text-primary-500 font-medium py-2 px-4 rounded-lg flex items-center shadow-md"
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Send Money
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default BalanceCard;
