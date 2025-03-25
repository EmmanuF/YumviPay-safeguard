
import React from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import NotificationToggle from './NotificationToggle';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
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
      case 'processing': return 60;
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
  
  const getStatusIcon = (status: TransactionStatus) => {
    switch(status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600 mr-1" />;
      case 'failed':
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-600 mr-1" />;
      default:
        return <Clock className="w-4 h-4 mr-1" />;
    }
  };
  
  const getStatusColor = (status: TransactionStatus): string => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': 
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-primary-50 text-primary-800';
    }
  };
  
  const bgColorClass = getStatusColor(status);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg ${bgColorClass} ${className}`}
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
      
      {/* Status indicator */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center text-sm font-medium">
            {getStatusIcon(status)}
            <span>{getEstimatedText(status)}</span>
          </div>
          {status !== 'completed' && status !== 'failed' && status !== 'cancelled' && (
            <span className="text-xs font-medium">{getProgressValue(status)}%</span>
          )}
        </div>
        
        {status !== 'completed' && status !== 'failed' && status !== 'cancelled' && (
          <Progress value={getProgressValue(status)} className="h-2" />
        )}
      </div>
    </motion.div>
  );
};

export default StatusUpdateBar;
