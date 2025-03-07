
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  recipientName: string;
  recipientCountry: string;
  recipientCountryCode: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  type: 'send' | 'receive';
}

interface TransactionCardProps {
  transaction: Transaction;
  onClick?: () => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onClick }) => {
  const { amount, currency, recipientName, status, date, type } = transaction;
  
  const statusColor = {
    completed: 'text-green-500',
    pending: 'text-amber-500',
    failed: 'text-red-500',
  };
  
  const statusBg = {
    completed: 'bg-green-100',
    pending: 'bg-amber-100',
    failed: 'bg-red-100',
  };
  
  const statusIcon = {
    completed: type === 'send' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />,
    pending: <Clock className="w-4 h-4" />,
    failed: <Clock className="w-4 h-4" />,
  };
  
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass-effect w-full rounded-xl p-4 mb-3 cursor-pointer hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center mr-3",
            statusBg[status]
          )}>
            {statusIcon[status]}
          </div>
          <div>
            <h3 className="font-medium text-foreground">
              {type === 'send' ? `To ${recipientName}` : `From ${recipientName}`}
            </h3>
            <p className="text-xs text-gray-500">{new Date(date).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className={cn(
            "font-semibold",
            type === 'send' ? 'text-red-500' : 'text-green-500'
          )}>
            {type === 'send' ? '-' : '+'}{amount} {currency}
          </p>
          <span className={cn(
            "text-xs py-1 px-2 rounded-full",
            statusBg[status],
            statusColor[status]
          )}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionCard;
