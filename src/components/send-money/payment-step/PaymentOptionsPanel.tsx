
import React from 'react';
import { motion } from 'framer-motion';
import FavoriteRecipients from '../payment/FavoriteRecipients';
import PreferredPaymentMethods from '../payment/PreferredPaymentMethods';

interface PaymentOptionsPanelProps {
  transactionData: {
    recipientCountry?: string;
    recipient: string | null;
    recipientName?: string;
    paymentMethod: string | null;
    selectedProvider?: string;
  };
  updateTransactionData: (data: Partial<any>) => void;
  preferredMethods: Array<{ methodId: string; providerId: string }>;
  selectedCountry: any;
}

const PaymentOptionsPanel: React.FC<PaymentOptionsPanelProps> = ({
  transactionData,
  updateTransactionData,
  preferredMethods,
  selectedCountry
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
      <FavoriteRecipients
        transactionData={transactionData}
        updateTransactionData={updateTransactionData}
      />
      
      <PreferredPaymentMethods
        preferredMethods={preferredMethods}
        countryCode={transactionData.recipientCountry || 'CM'}
        selectedCountry={selectedCountry}
        transactionData={transactionData}
        updateTransactionData={updateTransactionData}
      />
    </motion.div>
  );
};

export default PaymentOptionsPanel;
