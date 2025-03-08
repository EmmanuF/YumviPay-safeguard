
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import StatusUpdateBar from './StatusUpdateBar';

interface TransactionDetails {
  id: string;
  status: 'pending' | 'completed' | 'failed';
  amount: string;
  fee: string;
  totalAmount: string;
  recipient: string;
  date: string;
  estimatedDelivery: string;
}

interface StatusContentProps {
  transaction: TransactionDetails;
}

const StatusContent: React.FC<StatusContentProps> = ({ transaction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <div className="bg-primary-500 p-6 text-center text-white">
          <CheckCircle className="h-12 w-12 mx-auto mb-2" />
          <h2 className="text-xl font-semibold">Money Sent Successfully!</h2>
          <p className="opacity-90 text-sm mt-1">
            Transaction ID: {transaction.id}
          </p>
        </div>
        
        <div className="p-5 space-y-6">
          {/* Status Update Notifications */}
          <div className="mb-4">
            <StatusUpdateBar transactionId={transaction.id} />
          </div>
          
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
