
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCountries } from '@/hooks/useCountries';

interface ConfirmationStepProps {
  amount: string;
  selectedCountry: string;
  recipient: string;
  recipientName: string;
  selectedPaymentMethod: string;
  selectedProvider?: string;
  onConfirm: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  amount,
  selectedCountry,
  recipient,
  recipientName,
  selectedPaymentMethod,
  selectedProvider,
  onConfirm,
  onBack,
  isSubmitting
}) => {
  const { getCountryByCode } = useCountries();
  const selectedCountryData = getCountryByCode(selectedCountry);
  
  const paymentMethodName = selectedCountryData?.paymentMethods.find(
    pm => pm.id === selectedPaymentMethod
  )?.name || selectedPaymentMethod;
  
  // Calculate fee (simplified logic, same as in transactions service)
  const calculatedFee = (() => {
    const numAmount = parseFloat(amount);
    const baseFee = 2.99;
    const percentageFee = numAmount * 0.015;
    return (baseFee + percentageFee).toFixed(2);
  })();
  
  // Calculate total
  const totalAmount = (parseFloat(amount) + parseFloat(calculatedFee)).toFixed(2);
  
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Card className="p-5">
          <div className="flex items-start space-x-3 mb-4">
            <div className="flex-shrink-0 mt-0.5">
              <CheckCircle className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <h4 className="text-base font-medium text-primary-700">Confirm Your Transfer</h4>
              <p className="text-sm text-gray-600">Please review your transfer details before proceeding to payment</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">AMOUNT</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount to send</span>
                  <span className="font-medium">${amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transfer fee</span>
                  <span className="font-medium">${calculatedFee}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-semibold">${totalAmount}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">RECIPIENT</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{recipientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contact</span>
                  <span className="font-medium">{recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Country</span>
                  <span className="font-medium">{selectedCountryData?.name || selectedCountry}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">PAYMENT METHOD</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="font-medium">{paymentMethodName}</span>
                </div>
                {selectedProvider && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Provider</span>
                    <span className="font-medium">{selectedProvider}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-amber-50 p-3 rounded-lg flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                By proceeding, you'll be redirected to Kado to complete your payment securely. Make sure recipient details are correct as funds cannot be recovered if sent to the wrong person.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col space-y-3 pt-4">
        <Button 
          onClick={onConfirm} 
          className="w-full" 
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Proceed to Payment"}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="w-full" 
          size="lg"
          disabled={isSubmitting}
        >
          Back
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmationStep;
