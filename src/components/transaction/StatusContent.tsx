
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import StatusUpdateBar from './StatusUpdateBar';
import { TransactionStatus } from '@/types/transaction';
import { Progress } from '@/components/ui/progress';

interface TransactionDetails {
  id: string;
  status: TransactionStatus;
  amount: string;
  fee: string;
  totalAmount: string;
  recipient: string;
  date: string;
  estimatedDelivery: string;
  failureReason?: string;
}

interface StatusContentProps {
  transaction: TransactionDetails;
}

const StatusContent: React.FC<StatusContentProps> = ({ transaction }) => {
  const renderStatusHeader = () => {
    switch (transaction.status) {
      case 'completed':
        return (
          <div className="bg-green-500 p-6 text-center text-white">
            <CheckCircle className="h-12 w-12 mx-auto mb-2" />
            <h2 className="text-xl font-semibold">Money Sent Successfully!</h2>
            <p className="opacity-90 text-sm mt-1">
              Transaction ID: {transaction.id}
            </p>
          </div>
        );
      case 'failed':
        return (
          <div className="bg-red-500 p-6 text-center text-white">
            <XCircle className="h-12 w-12 mx-auto mb-2" />
            <h2 className="text-xl font-semibold">Transaction Failed</h2>
            <p className="opacity-90 text-sm mt-1">
              Transaction ID: {transaction.id}
            </p>
          </div>
        );
      case 'cancelled':
        return (
          <div className="bg-red-500 p-6 text-center text-white">
            <XCircle className="h-12 w-12 mx-auto mb-2" />
            <h2 className="text-xl font-semibold">Transaction Cancelled</h2>
            <p className="opacity-90 text-sm mt-1">
              Transaction ID: {transaction.id}
            </p>
          </div>
        );
      case 'offline-pending':
        return (
          <div className="bg-amber-500 p-6 text-center text-white">
            <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
            <h2 className="text-xl font-semibold">Pending Offline</h2>
            <p className="opacity-90 text-sm mt-1">
              Transaction ID: {transaction.id}
            </p>
            <p className="opacity-90 text-sm mt-1">
              Will be processed when you're back online
            </p>
          </div>
        );
      case 'processing':
        return (
          <div className="bg-blue-500 p-6 text-center text-white">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mx-auto mb-2"
            >
              <RefreshCw className="h-12 w-12" />
            </motion.div>
            <h2 className="text-xl font-semibold">Processing Payment</h2>
            <p className="opacity-90 text-sm mt-1">
              Transaction ID: {transaction.id}
            </p>
          </div>
        );
      case 'pending':
      default:
        return (
          <div className="bg-amber-500 p-6 text-center text-white">
            <Clock className="h-12 w-12 mx-auto mb-2" />
            <h2 className="text-xl font-semibold">Transaction Processing</h2>
            <p className="opacity-90 text-sm mt-1">
              Transaction ID: {transaction.id}
            </p>
          </div>
        );
    }
  };

  // Calculate progress based on transaction status
  const getProgressValue = (status: TransactionStatus): number => {
    switch(status) {
      case 'pending': return 25;
      case 'processing': return 65;
      case 'completed': return 100;
      case 'failed': return 100;
      case 'cancelled': return 100;
      case 'offline-pending': return 15;
      default: return 0;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        {renderStatusHeader()}
        
        <div className="p-5 space-y-6">
          {/* Transaction Progress Indicator */}
          {(transaction.status === 'pending' || transaction.status === 'processing') && (
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Transaction Progress</span>
                <span>{getProgressValue(transaction.status)}%</span>
              </div>
              <Progress value={getProgressValue(transaction.status)} className="h-2" />
            </div>
          )}
          
          {/* Status Update Notifications */}
          <div className="mb-4">
            <StatusUpdateBar 
              transactionId={transaction.id} 
              status={transaction.status}
            />
          </div>
          
          {transaction.status === 'failed' && transaction.failureReason && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-4">
              <h3 className="text-red-800 font-medium mb-1">Reason for Failure</h3>
              <p className="text-red-700 text-sm">{transaction.failureReason}</p>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              TRANSACTION DETAILS
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Sent</span>
                <span className="font-medium">${transaction.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fee</span>
                <span className="font-medium">${transaction.fee}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold">${transaction.totalAmount}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              RECIPIENT
            </h3>
            <p className="font-medium">{transaction.recipient}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              DELIVERY
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{transaction.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Delivery</span>
                <span className="font-medium">{transaction.estimatedDelivery}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatusContent;
