
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, CreditCard, Smartphone, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PaymentMethodCard from '@/components/PaymentMethodCard';
import { useToast } from '@/components/ui/use-toast';
import { useCountries } from '@/hooks/useCountries';

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

  const handlePaymentMethodSelect = (method: string) => {
    onSelectPaymentMethod(method);
    
    // Find the payment method name to display in the toast
    const paymentMethod = selectedCountryData?.paymentMethods.find(pm => pm.id === method);
    
    toast({
      title: "Payment method selected",
      description: `You've selected ${paymentMethod?.name || method}`,
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

  // Get the icon component based on the icon name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'smartphone':
        return <Smartphone className="h-5 w-5 text-primary-500" />;
      case 'bank':
        return <Building className="h-5 w-5 text-primary-500" />;
      case 'credit-card':
        return <CreditCard className="h-5 w-5 text-primary-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-primary-500" />;
    }
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
          {selectedCountryData?.paymentMethods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              name={method.name}
              description={method.description}
              icon={getIconComponent(method.icon)}
              isSelected={selectedPaymentMethod === method.id}
              onClick={() => handlePaymentMethodSelect(method.id)}
            />
          ))}
          
          {(!selectedCountryData || selectedCountryData.paymentMethods.length === 0) && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm">
                No payment methods available for this country. Please select a different country.
              </p>
            </div>
          )}
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
                <p>Destination: {selectedCountryData?.name || selectedCountry}</p>
                <p>Recipient: {recipient || 'Not specified'}</p>
                {selectedPaymentMethod && selectedCountryData && (
                  <p>Payment method: {
                    selectedCountryData.paymentMethods.find(pm => pm.id === selectedPaymentMethod)?.name || 
                    selectedPaymentMethod
                  }</p>
                )}
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
          disabled={!selectedPaymentMethod || !selectedCountryData || selectedCountryData.paymentMethods.length === 0}
        >
          Proceed to Payment
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PaymentStep;
