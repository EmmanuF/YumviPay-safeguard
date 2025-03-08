
import React from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import NotificationToggle from './NotificationToggle';

interface StatusUpdateBarProps {
  transactionId: string;
  variant?: 'default' | 'compact';
  className?: string;
}

const StatusUpdateBar: React.FC<StatusUpdateBarProps> = ({ 
  transactionId, 
  variant = 'default',
  className = ''
}) => {
  const [isNotifying, setIsNotifying] = React.useState(true);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-primary-50 p-4 rounded-lg flex items-center justify-between ${className}`}
    >
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
    </motion.div>
  );
};

export default StatusUpdateBar;
