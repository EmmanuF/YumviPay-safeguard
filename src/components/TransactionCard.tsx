
import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Clock, CheckCircle, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Transaction } from '@/types/transaction';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

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
      case 'processing':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="h-5 w-5 text-blue-500" />
          </motion.div>
        );
      case 'offline-pending':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'pending':
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
      case 'processing':
        return 'text-blue-600';
      case 'offline-pending':
        return 'text-orange-600';
      case 'pending':
      default:
        return 'text-amber-600';
    }
  };

  const getStatusBadge = () => {
    switch (transaction.status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Failed
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Processing
          </Badge>
        );
      case 'offline-pending':
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Offline
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Pending
          </Badge>
        );
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
          <div className="flex items-center justify-end mt-1">
            {getStatusIcon()}
            <div className="ml-1">
              {getStatusBadge()}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TransactionCard;
