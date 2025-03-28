
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSendMoneySteps } from '@/hooks/useSendMoneySteps';
import Header from '@/components/Header';
import SendMoneyProgressStepper from '@/components/send-money/SendMoneyProgressStepper';
import SendMoneyContent from '@/components/send-money/SendMoneyContent';

const SendMoney: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentStep, 
    isSubmitting, 
    error, 
    handleNext, 
    handleBack 
  } = useSendMoneySteps();
  
  // Create a state to track progress percentage
  const [progressPercentage, setProgressPercentage] = useState(0);
  
  // Create a state to hold transaction data
  const [transactionData, setTransactionData] = useState<any>(() => {
    // Try to restore previous transaction data from localStorage
    try {
      const savedData = localStorage.getItem('pendingTransaction');
      return savedData ? JSON.parse(savedData) : {
        amount: 100,
        sourceCurrency: 'USD',
        targetCurrency: 'XAF',
        exchangeRate: 610,
        convertedAmount: 61000,
        targetCountry: 'CM',
      };
    } catch (e) {
      console.error('Error loading transaction data:', e);
      return {
        amount: 100,
        sourceCurrency: 'USD',
        targetCurrency: 'XAF',
        exchangeRate: 610,
        convertedAmount: 61000,
        targetCountry: 'CM',
      };
    }
  });

  // Update transaction data and save to localStorage
  const updateTransactionData = (data: Partial<any>) => {
    setTransactionData(prev => {
      const updated = { ...prev, ...data };
      try {
        localStorage.setItem('pendingTransaction', JSON.stringify(updated));
        console.log("Transaction data updated:", updated);
      } catch (e) {
        console.error('Error saving transaction data:', e);
      }
      return updated;
    });
  };

  // Get steps for determining progress
  const steps = ['recipient', 'payment', 'confirmation', 'complete'];
  
  // Get current step index
  const currentStepIndex = steps.findIndex(step => step === currentStep);
  
  // Update progress percentage based on the current step
  useEffect(() => {
    // Calculate progress percentage: 25% for each completed step
    const newProgressPercentage = (currentStepIndex / (steps.length - 1)) * 100;
    
    // Animate the progress percentage
    const interval = setInterval(() => {
      setProgressPercentage(prev => {
        if (Math.abs(prev - newProgressPercentage) < 1) {
          clearInterval(interval);
          return newProgressPercentage;
        }
        return prev < newProgressPercentage ? prev + 1 : prev - 1;
      });
    }, 10);
    
    return () => clearInterval(interval);
  }, [currentStepIndex]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };
  
  // Log when the current step changes
  useEffect(() => {
    console.log("SendMoney page: Current step changed to", currentStep);
  }, [currentStep]);

  return (
    <motion.div 
      className="flex flex-col min-h-screen bg-gradient-to-br from-background to-muted/40"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Header title="Send Money" showBackButton onBackClick={handleBack} />
      
      <SendMoneyProgressStepper 
        currentStep={currentStep} 
        progressPercentage={progressPercentage} 
      />
      
      <SendMoneyContent
        currentStep={currentStep}
        transactionData={transactionData}
        updateTransactionData={updateTransactionData}
        onNext={handleNext}
        onBack={handleBack}
        isSubmitting={isSubmitting}
        error={error}
      />
    </motion.div>
  );
};

export default SendMoney;
