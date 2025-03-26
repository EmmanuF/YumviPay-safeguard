
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { useSendMoneySteps } from '@/hooks/useSendMoneySteps';
import SendMoneyStepRenderer from '@/components/send-money/SendMoneyStepRenderer';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

const SendMoney: React.FC = () => {
  const navigate = useNavigate();
  const [transactionData, setTransactionData] = useState<any>({
    amount: parseFloat(localStorage.getItem('lastTransactionAmount') || '50'),
    sourceCurrency: 'USD',
    targetCurrency: 'XAF',
    exchangeRate: 610,
    convertedAmount: parseFloat(localStorage.getItem('lastTransactionAmount') || '50') * 610,
    targetCountry: 'CM',
    recipientName: '',
    recipient: '',
    paymentMethod: '',
    selectedProvider: ''
  });
  
  const {
    currentStep,
    isSubmitting,
    error,
    handleNext,
    handleBack
  } = useSendMoneySteps();
  
  useEffect(() => {
    // Attempt to recover transaction data from localStorage
    try {
      const storedData = localStorage.getItem('pendingTransaction');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log('Recovered transaction data:', parsedData);
        setTransactionData(prevData => ({...prevData, ...parsedData}));
        
        toast.success('Transaction data recovered', {
          description: 'Your previous transaction data has been loaded'
        });
      }
    } catch (e) {
      console.error('Error recovering transaction data:', e);
    }
  }, []);
  
  const updateTransactionData = (data: Partial<any>) => {
    setTransactionData(prev => {
      const updated = {...prev, ...data};
      
      // Ensure convertedAmount is recalculated when amount changes
      if (data.amount !== undefined) {
        updated.convertedAmount = data.amount * updated.exchangeRate;
      }
      
      // Store in localStorage for recovery
      try {
        localStorage.setItem('pendingTransaction', JSON.stringify(updated));
      } catch (e) {
        console.error('Error storing transaction data:', e);
      }
      
      return updated;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/60">
      <Header 
        title={
          currentStep === 'recipient' ? 'Select Recipient' :
          currentStep === 'payment' ? 'Payment Method' :
          currentStep === 'confirmation' ? 'Review Transfer' : 'Send Money'
        } 
        showBackButton 
        onBackClick={handleBack}
      />
      
      <div className="flex-1 p-4 md:p-6 pt-2 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <SendMoneyStepRenderer
              currentStep={currentStep}
              transactionData={transactionData}
              updateTransactionData={updateTransactionData}
              onNext={handleNext}
              onBack={handleBack}
              isSubmitting={isSubmitting}
              error={error}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
      <BottomNavigation />
      <Toaster />
    </div>
  );
};

export default SendMoney;
