
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { useCountries } from '@/hooks/useCountries';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import PaymentStepNavigation from './payment/PaymentStepNavigation';
import { Building, Smartphone, CreditCard, CircleCheck } from 'lucide-react';
import { toast } from 'sonner';

// Import our components
import PaymentStepHeader from './payment/PaymentStepHeader';
import PreferredMethodsSection from './payment/PreferredMethodsSection';
import AvailableMethodsSection from './payment/AvailableMethodsSection';
import QRCodeSection from './payment/QRCodeSection';
import SavePreferenceSection from './payment/SavePreferenceSection';

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
  console.log('[PaymentStep] Rendering with props:', {
    onNext: typeof onNext,
    onBack: typeof onBack,
    isSubmitting,
    transactionData: {
      paymentMethod: transactionData?.paymentMethod,
      selectedProvider: transactionData?.selectedProvider
    }
  });

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
  
  // Animation variants
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

  // Logging to ensure we have proper navigation functions
  console.log('[PaymentStep] Navigation functions check:', { 
    onNext: typeof onNext, 
    onBack: typeof onBack
  });
  
  // Direct function references without additional wrapper
  const handleNext = () => {
    console.log('[PaymentStep] Direct handleNext called');
    if (typeof onNext === 'function') {
      onNext();
    } else {
      console.error('[PaymentStep] onNext is not available or not a function');
    }
  };
  
  const handleBack = () => {
    console.log('[PaymentStep] Direct handleBack called');
    if (typeof onBack === 'function') {
      onBack();
    } else {
      console.error('[PaymentStep] onBack is not available or not a function');
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 flex flex-col"
    >
      <motion.div variants={itemVariants} className="flex-grow">
        <Card className="border-0 shadow-lg bg-white">
          <PaymentStepHeader 
            amount={transactionData.amount}
            sourceCurrency={transactionData.sourceCurrency}
            recipientName={transactionData.recipientName}
          />
          
          <CardContent className="pt-0">
            <PreferredMethodsSection 
              preferredMethods={preferredMethods}
              countryCode={transactionData.targetCountry || 'CM'}
              selectedCountry={selectedCountry}
              transactionData={transactionData}
              updateTransactionData={updateTransactionData}
            />
            
            <AvailableMethodsSection 
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
            
            <QRCodeSection transactionData={transactionData} />
            
            <SavePreferenceSection 
              showSection={!!transactionData.paymentMethod}
              savePreference={savePreference}
              onToggle={handleSavePreference}
            />
          </CardContent>
        </Card>
      </motion.div>
      
      <div className="sticky bottom-0 pt-4 pb-2 bg-background">
        <PaymentStepNavigation 
          onNext={handleNext}
          onBack={handleBack}
          isNextDisabled={isNextDisabled}
          isSubmitting={isSubmitting}
          nextLabel="Continue"
        />
      </div>
    </motion.div>
  );
};

export default PaymentStep;
