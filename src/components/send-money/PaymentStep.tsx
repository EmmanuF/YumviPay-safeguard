
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import CountryPaymentMethods from './payment/CountryPaymentMethods';
import RecurringPaymentOption from './payment/RecurringPaymentOption';
import FavoriteRecipients from './payment/FavoriteRecipients';
import PreferredPaymentMethods from './payment/PreferredPaymentMethods';
import { useCountries } from '@/hooks/useCountries';
import { createRecurringPayment } from '@/services/recurringPayments';

interface PaymentStepProps {
  transactionData: {
    amount: number;
    sourceCurrency: string;
    targetCurrency: string;
    convertedAmount: number;
    recipient: string | null;
    recipientName?: string;
    recipientCountry?: string;
    paymentMethod: string | null;
    selectedProvider?: string;
  };
  updateTransactionData: (data: Partial<any>) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  transactionData,
  updateTransactionData,
  onNext,
  onBack,
  isSubmitting = false
}) => {
  const { toast } = useToast();
  const { getCountryByCode } = useCountries();
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [preferredMethods, setPreferredMethods] = useState<Array<{ methodId: string; providerId: string }>>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('monthly');
  
  useEffect(() => {
    if (transactionData.recipientCountry) {
      const country = getCountryByCode(transactionData.recipientCountry);
      setSelectedCountry(country);
    }
  }, [transactionData.recipientCountry, getCountryByCode]);

  const handleRecurringChange = (isRecurring: boolean, frequency: string) => {
    setIsRecurring(isRecurring);
    setRecurringFrequency(frequency);
    
    // Update transaction data with recurring info
    updateTransactionData({
      isRecurring,
      recurringFrequency: isRecurring ? frequency : null
    });
  };

  const handleContinue = async () => {
    if (!transactionData.paymentMethod || !transactionData.selectedProvider) {
      toast({
        title: "Payment method required",
        description: "Please select a payment method to continue.",
        variant: "destructive",
      });
      return;
    }
    
    // Create recurring payment if enabled
    if (isRecurring && transactionData.recipientId) {
      try {
        await createRecurringPayment(
          transactionData.recipientId,
          transactionData.amount.toString(),
          transactionData.targetCurrency,
          transactionData.paymentMethod,
          transactionData.selectedProvider || '',
          recurringFrequency
        );
        
        toast({
          title: "Recurring payment scheduled",
          description: `Your payment will be processed ${recurringFrequency} until cancelled.`,
        });
      } catch (error) {
        console.error('Error setting up recurring payment:', error);
        toast({
          title: "Couldn't schedule recurring payment",
          description: "We'll still process this one-time payment.",
          variant: "destructive",
        });
      }
    }
    
    onNext();
  };

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
        <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>
        
        {/* Favorite Recipients Section */}
        <FavoriteRecipients
          transactionData={transactionData}
          updateTransactionData={updateTransactionData}
        />
        
        {/* Preferred Payment Methods */}
        <PreferredPaymentMethods
          preferredMethods={preferredMethods}
          countryCode={transactionData.recipientCountry || 'CM'}
          selectedCountry={selectedCountry}
          transactionData={transactionData}
          updateTransactionData={updateTransactionData}
        />
        
        {/* Recurring Payment Option */}
        <RecurringPaymentOption
          transactionData={transactionData}
          onRecurringChange={handleRecurringChange}
        />
        
        {/* Country Payment Methods */}
        <Card className="overflow-hidden mb-4">
          <CountryPaymentMethods
            countryCode={transactionData.recipientCountry || 'CM'}
            selectedPaymentMethod={transactionData.paymentMethod}
            selectedProvider={transactionData.selectedProvider}
            onSelect={(method, provider) => {
              updateTransactionData({
                paymentMethod: method,
                selectedProvider: provider
              });
            }}
          />
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants} className="pt-4 flex space-x-3">
        <Button 
          variant="outline"
          onClick={onBack} 
          className="w-1/2" 
          size="lg"
          disabled={isSubmitting}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button 
          onClick={handleContinue} 
          className="w-1/2" 
          size="lg"
          disabled={isSubmitting || !transactionData.paymentMethod}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PaymentStep;
