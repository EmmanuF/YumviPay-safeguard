
import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Building, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useCountries } from '@/hooks/useCountries';
import PaymentMethodList from './PaymentMethodList';
import TransactionSummary from './TransactionSummary';
import { providerOptions } from './PaymentProviderData';

interface PaymentStepProps {
  amount: string;
  selectedCountry: string;
  recipient: string;
  recipientName: string;
  selectedPaymentMethod: string;
  onSelectPaymentMethod: (method: string) => void;
  onNext: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  amount,
  selectedCountry,
  recipient,
  recipientName,
  selectedPaymentMethod,
  onSelectPaymentMethod,
  onNext,
}) => {
  const { toast } = useToast();
  const { getCountryByCode } = useCountries();
  const selectedCountryData = getCountryByCode(selectedCountry);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  const handleProceedToPayment = () => {
    toast({
      title: "Processing payment",
      description: "Redirecting to payment gateway",
      duration: 3000,
    });
    onNext();
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PaymentMethodList 
        selectedCountry={selectedCountry}
        selectedCountryData={selectedCountryData}
        selectedPaymentMethod={selectedPaymentMethod}
        onSelectPaymentMethod={onSelectPaymentMethod}
        providerOptions={providerOptions}
      />

      <TransactionSummary 
        amount={amount}
        selectedCountryData={selectedCountryData}
        selectedCountry={selectedCountry}
        recipientName={recipientName}
        recipient={recipient}
        selectedPaymentMethod={selectedPaymentMethod}
      />

      <motion.div variants={itemVariants} className="pt-4">
        <Button 
          onClick={handleProceedToPayment} 
          className="w-full" 
          size="lg"
          disabled={!selectedPaymentMethod || !selectedCountryData || selectedCountryData.paymentMethods.length === 0}
        >
          Proceed to Payment
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PaymentStep;
