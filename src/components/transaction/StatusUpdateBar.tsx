
import React from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import NotificationToggle from './NotificationToggle';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';
import { TransactionStatus } from '@/types/transaction';

interface StatusUpdateBarProps {
  transactionId: string;
  variant?: 'default' | 'compact';
  className?: string;
  status?: TransactionStatus;
}

const StatusUpdateBar: React.FC<StatusUpdateBarProps> = ({ 
  transactionId, 
  variant = 'default',
  className = '',
  status = 'pending'
}) => {
  const [isNotifying, setIsNotifying] = React.useState(true);
  
  // Calculate progress based on transaction status
  const getProgressValue = (status: TransactionStatus): number => {
    switch(status) {
      case 'pending': return 25;
      case 'processing': return 50;
      case 'completed': return 100;
      case 'failed': return 100;
      case 'cancelled': return 100;
      case 'offline-pending': return 15;
      default: return 0;
    }
  };

  // Get estimated delivery text based on status
  const getEstimatedText = (status: TransactionStatus): string => {
    switch(status) {
      case 'pending': return 'Processing your transaction (typically instant to 5 minutes)...';
      case 'processing': return 'Verifying with payment provider (usually completed within minutes)...';
      case 'completed': return 'Transaction completed successfully';
      case 'failed': return 'Transaction failed';
      case 'cancelled': return 'Transaction cancelled';
      case 'offline-pending': return 'Will process when back online';
      default: return 'Transaction typically completes within minutes...';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-primary-50 p-4 rounded-lg ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <NotificationToggle 
          isActive={isNotifying}
          onChange={setIsNotifying}
          entityId={transactionId}
          entityType="transaction"
        />
        <Switch 
          checked={isNotifying} 
          onCheckedChange={setIsNotifying} 
        />
      </div>
      
      {/* Add progress indicator */}
      {status !== 'completed' && status !== 'failed' && status !== 'cancelled' && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center text-sm text-primary-700">
              <Clock className="w-3 h-3 mr-1" />
              <span>{getEstimatedText(status)}</span>
            </div>
            <span className="text-xs font-medium">{getProgressValue(status)}%</span>
          </div>
          <Progress value={getProgressValue(status)} className="h-2" />
        </div>
      )}
    </motion.div>
  );
};

export default StatusUpdateBar;
