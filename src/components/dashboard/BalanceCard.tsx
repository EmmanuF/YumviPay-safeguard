
import React from 'react';
import { motion } from 'framer-motion';
import { User, Plus, CreditCard, Wallet } from 'lucide-react';
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
  
  // Format the greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="mb-6 relative">
      <div className="rounded-xl p-6 bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-xl relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute left-1/4 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-xl opacity-70"></div>
        <div className="absolute -left-16 top-1/3 w-24 h-24 rounded-full bg-white/5 blur-lg"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div 
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white/20"
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%", 
                opacity: 0.3 + Math.random() * 0.4
              }}
              animate={{ 
                y: [0, Math.random() * -20 - 10],
                opacity: [0.3 + Math.random() * 0.4, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2 + Math.random() * 3,
                ease: "easeInOut",
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>
        
        <div className="flex justify-between items-start mb-6 relative">
          <div>
            <p className="text-primary-100 text-sm font-medium mb-1">{getGreeting()}</p>
            <h2 className="text-xl font-bold">{userName}</h2>
          </div>
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/20 rounded-full p-2 backdrop-blur-sm"
          >
            <User className="w-5 h-5" />
          </motion.div>
        </div>
        
        <div className="flex justify-between items-end relative">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary-100" />
              <p className="text-primary-100 text-sm">Recent Transfer</p>
            </div>
            <motion.p 
              className="text-2xl font-bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {transactions.length > 0 ? `$${transactions[0].amount}` : '$0'}
            </motion.p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, y: -3, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/send')}
            className="bg-white text-primary-700 font-medium py-2 px-4 rounded-xl flex items-center shadow-lg"
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Send Money
          </motion.button>
        </div>
        
        {/* Card decorative element */}
        <motion.div 
          className="absolute -right-8 bottom-1/3 opacity-10"
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Wallet className="w-24 h-24" />
        </motion.div>
      </div>
      
      {/* Card shadow effect */}
      <div className="absolute inset-x-4 bottom-0 h-4 bg-primary-500/20 blur-xl -z-10 rounded-full"></div>
    </div>
  );
};

export default BalanceCard;
