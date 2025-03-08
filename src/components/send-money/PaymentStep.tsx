
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, CreditCard, Smartphone, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PaymentMethodCard from '@/components/PaymentMethodCard';
import { useToast } from '@/components/ui/use-toast';

interface PaymentStepProps {
  amount: string;
  selectedCountry: string;
  recipient: string;
  selectedPaymentMethod: string;
  onSelectPaymentMethod: (method: string) => void;
  onNext: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  amount,
  selectedCountry,
  recipient,
  selectedPaymentMethod,
  onSelectPaymentMethod,
  onNext,
}) => {
  const { toast } = useToast();
  
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

  const handlePaymentMethodSelect = (method: string) => {
    onSelectPaymentMethod(method);
    toast({
      title: "Payment method selected",
      description: `You've selected ${method === 'credit-card' ? 'Credit Card' : method === 'bank' ? 'Bank Transfer' : 'Mobile Money'}`,
      duration: 2000,
    });
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
      <motion.div variants={itemVariants} className="mb-4">
        <h3 className="text-sm font-medium mb-3">Select Payment Method</h3>
        <div className="space-y-3">
          <PaymentMethodCard
            name="Credit Card"
            description="Pay with debit or credit card"
            icon={<CreditCard className="h-5 w-5 text-primary-500" />}
            isSelected={selectedPaymentMethod === 'credit-card'}
            onClick={() => handlePaymentMethodSelect('credit-card')}
          />
          <PaymentMethodCard
            name="Bank Transfer"
            description="Direct bank transfer"
            icon={<Building className="h-5 w-5 text-primary-500" />}
            isSelected={selectedPaymentMethod === 'bank'}
            onClick={() => handlePaymentMethodSelect('bank')}
          />
          <PaymentMethodCard
            name="Mobile Money"
            description="Pay using mobile wallet"
            icon={<Smartphone className="h-5 w-5 text-primary-500" />}
            isSelected={selectedPaymentMethod === 'mobile-money'}
            onClick={() => handlePaymentMethodSelect('mobile-money')}
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="p-4 bg-primary-50 border-primary-100">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              <CheckCircle className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-primary-700">Transaction Summary</h4>
              <div className="mt-2 text-sm text-gray-600 space-y-1">
                <p>Amount: ${amount}</p>
                <p>Destination: {selectedCountry}</p>
                <p>Recipient: {recipient || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="pt-4">
        <Button 
          onClick={handleProceedToPayment} 
          className="w-full" 
          size="lg"
          disabled={!selectedPaymentMethod}
        >
          Proceed to Payment
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PaymentStep;
