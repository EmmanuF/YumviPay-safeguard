
import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

export interface Transaction {
  id: string;
  amount: string;
  recipientName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  country: string;
}

interface TransactionCardProps {
  transaction: Transaction;
  onClick?: () => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onClick }) => {
  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
      case 'processing':
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'pending':
      case 'processing':
      default:
        return 'text-amber-600';
    }
  };

  const formatTimeAgo = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Card
      className="mb-3 p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center mr-3">
            <ArrowUpRight className="h-5 w-5 text-primary-500" />
          </div>
          <div>
            <p className="font-medium">{transaction.recipientName}</p>
            <p className="text-sm text-gray-500">{formatTimeAgo(transaction.createdAt)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium">${transaction.amount}</p>
          <div className="flex items-center justify-end">
            {getStatusIcon()}
            <span className={`text-xs ml-1 ${getStatusColor()}`}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TransactionCard;
