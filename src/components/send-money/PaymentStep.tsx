import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { useCountries } from '@/hooks/useCountries';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import CountryPaymentMethods from './payment/CountryPaymentMethods';
import PreferredPaymentMethods from './payment/PreferredPaymentMethods';
import PaymentStepNavigation from './payment/PaymentStepNavigation';
import { Building, Smartphone, CreditCard, CircleCheck } from 'lucide-react';
import SavePreferenceToggle from './payment/SavePreferenceToggle';
import QRCodeOption from './payment/QRCodeOption';
import { toast } from 'sonner';

interface PaymentStepProps {
  transactionData: any;
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
  const [savePreference, setSavePreference] = useState(false);
  const { getCountryByCode } = useCountries();
  const { paymentMethods, isLoading } = usePaymentMethods(transactionData.targetCountry || 'CM');
  const selectedCountry = getCountryByCode(transactionData.targetCountry || 'CM');
  
  const [preferredMethods, setPreferredMethods] = useState<Array<{methodId: string; providerId: string}>>([]);
  
  useEffect(() => {
    try {
      const storedPreferences = localStorage.getItem('preferredPaymentMethods');
      if (storedPreferences) {
        setPreferredMethods(JSON.parse(storedPreferences));
      }
    } catch (e) {
      console.error('Error loading preferred payment methods:', e);
    }
  }, []);
  
  const handleSavePreference = (save: boolean) => {
    setSavePreference(save);
    
    if (save && transactionData.paymentMethod && transactionData.selectedProvider) {
      try {
        const existingIndex = preferredMethods.findIndex(
          p => p.methodId === transactionData.paymentMethod && p.providerId === transactionData.selectedProvider
        );
        
        if (existingIndex === -1) {
          const updatedPreferences = [
            {
              methodId: transactionData.paymentMethod,
              providerId: transactionData.selectedProvider
            },
            ...preferredMethods
          ].slice(0, 3);
          
          setPreferredMethods(updatedPreferences);
          localStorage.setItem('preferredPaymentMethods', JSON.stringify(updatedPreferences));
          
          toast.success('Payment method saved', {
            description: 'Your preference has been saved for future transfers'
          });
        }
      } catch (e) {
        console.error('Error saving payment preference:', e);
      }
    }
  };
  
  const getPaymentMethodIcon = (methodId: string) => {
    switch (methodId) {
      case 'mobile_money':
        return <Smartphone className="h-6 w-6 text-primary" />;
      case 'bank_transfer':
        return <Building className="h-6 w-6 text-primary" />;
      case 'credit_card':
        return <CreditCard className="h-6 w-6 text-primary" />;
      default:
        return <CircleCheck className="h-6 w-6 text-primary" />;
    }
  };
  
  const isNextDisabled = !transactionData.paymentMethod || !transactionData.selectedProvider;
  
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
      className="space-y-4"
    >
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Select Payment Method</CardTitle>
            <CardDescription>
              Choose how you want to send {transactionData.amount} {transactionData.sourceCurrency} 
              to {transactionData.recipientName || 'your recipient'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-0">
            {preferredMethods.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2 text-muted-foreground">Your preferred methods</h3>
                <PreferredPaymentMethods
                  preferredMethods={preferredMethods}
                  countryCode={transactionData.targetCountry || 'CM'}
                  selectedCountry={selectedCountry}
                  transactionData={transactionData}
                  updateTransactionData={updateTransactionData}
                />
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium mb-2 text-muted-foreground">Available payment methods</h3>
              <CountryPaymentMethods
                countryCode={transactionData.targetCountry || 'CM'}
                methods={paymentMethods}
                isLoading={isLoading}
                selectedMethod={transactionData.paymentMethod}
                selectedProvider={transactionData.selectedProvider}
                onSelectMethod={(methodId, providerId) => {
                  updateTransactionData({
                    paymentMethod: methodId,
                    selectedProvider: providerId
                  });
                }}
                getMethodIcon={getPaymentMethodIcon}
              />
            </div>
            
            <div className="mt-6">
              <QRCodeOption
                transactionData={transactionData}
                onScanComplete={(data) => {
                  console.log("QR Code scan completed with data:", data);
                  toast.info('QR code scanned successfully', {
                    description: 'The recipient details have been filled in'
                  });
                }}
              />
            </div>
            
            {transactionData.paymentMethod && (
              <div className="mt-6">
                <SavePreferenceToggle
                  checked={savePreference}
                  onChange={handleSavePreference}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants} className="mt-4">
        <PaymentStepNavigation 
          onNext={onNext}
          onBack={onBack}
          isNextDisabled={isNextDisabled}
          isSubmitting={isSubmitting}
          nextLabel="Continue"
        />
      </motion.div>
    </motion.div>
  );
};

export default PaymentStep;
