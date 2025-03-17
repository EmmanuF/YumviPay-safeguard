
import React from 'react';
import { motion } from 'framer-motion';
import RecurringPaymentOption from '../payment/RecurringPaymentOption';

interface RecurringPaymentPanelProps {
  transactionData: any;
  onRecurringChange: (isRecurring: boolean, frequency: string) => void;
}

const RecurringPaymentPanel: React.FC<RecurringPaymentPanelProps> = ({ 
  transactionData, 
  onRecurringChange 
}) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <RecurringPaymentOption
        transactionData={transactionData}
        onRecurringChange={onRecurringChange}
      />
    </motion.div>
  );
};

export default RecurringPaymentPanel;
