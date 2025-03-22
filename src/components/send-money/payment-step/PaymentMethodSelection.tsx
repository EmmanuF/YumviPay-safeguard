
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import CountryPaymentMethods from '../payment/CountryPaymentMethods';
import NameMatchConfirmation from '../payment/NameMatchConfirmation';

interface PaymentMethodSelectionProps {
  transactionData: {
    recipientCountry?: string;
    paymentMethod: string | null;
    selectedProvider?: string;
    recipientName?: string;
  };
  updateTransactionData: (data: Partial<any>) => void;
  isDetailsConfirmed: boolean;
  onConfirmationChange: (checked: boolean) => void;
  showConfirmationError: boolean;
}

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({
  transactionData,
  updateTransactionData,
  isDetailsConfirmed,
  onConfirmationChange,
  showConfirmationError
}) => {
  const { toast } = useToast();
  const comingSoonProviders = ['yoomee_money', 'afriland', 'ecobank'];
  const comingSoonMethods = ['bank_transfer'];
  
  const handleMethodSelect = (method: string, provider: string) => {
    console.log(`DEBUG - handleMethodSelect called with method: "${method}", provider: "${provider}"`);
    
    if (comingSoonMethods.includes(method)) {
      console.log(`DEBUG - Method "${method}" is marked as coming soon`);
      toast({
        title: "Coming Soon",
        description: "This payment method will be available soon. Please select Mobile Money for now.",
        variant: "default",
      });
      return;
    }
    
    if (comingSoonProviders.includes(provider)) {
      console.log(`DEBUG - Provider "${provider}" is marked as coming soon`);
      toast({
        title: "Coming Soon",
        description: "This payment provider will be available soon. Please select MTN Mobile Money or Orange Money.",
        variant: "default",
      });
      return;
    }

    console.log(`DEBUG - Updating transaction data with method: "${method}", provider: "${provider}"`);
    updateTransactionData({
      paymentMethod: method,
      selectedProvider: provider
    });
  };

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
      <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>
      
      <Card className="overflow-hidden mb-4">
        <CountryPaymentMethods
          countryCode={transactionData.recipientCountry || 'CM'}
          selectedPaymentMethod={transactionData.paymentMethod}
          selectedProvider={transactionData.selectedProvider}
          onSelect={handleMethodSelect}
        />
      </Card>
      
      {transactionData.paymentMethod && transactionData.selectedProvider && transactionData.recipientName && (
        <NameMatchConfirmation 
          isChecked={isDetailsConfirmed}
          onCheckedChange={onConfirmationChange}
          showError={showConfirmationError}
        />
      )}
    </motion.div>
  );
};

export default PaymentMethodSelection;
