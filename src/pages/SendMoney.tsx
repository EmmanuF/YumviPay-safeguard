
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { useSendMoneySteps } from '@/hooks/useSendMoneySteps';
import SendMoneyStepRenderer from '@/components/send-money/SendMoneyStepRenderer';
import { Check, ChevronRight } from 'lucide-react';

// Define stepper steps with enhanced naming
const steps = [
  { id: 'recipient', label: 'Recipient' },
  { id: 'payment', label: 'Payment' },
  { id: 'confirmation', label: 'Review' },
  { id: 'complete', label: 'Complete' },
];

const SendMoney: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentStep, 
    isSubmitting, 
    error, 
    handleNext, 
    handleBack 
  } = useSendMoneySteps();
  
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

  // Get current step index
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
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
      
      {/* Enhanced Stepper component with animations */}
      <div className="bg-white shadow-sm relative overflow-hidden sticky top-0 z-10">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30"></div>
        
        <div className="container px-4 py-6">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                {/* Step circle with enhanced styling */}
                <div className="flex flex-col items-center">
                  <motion.div 
                    className={`rounded-full w-10 h-10 flex items-center justify-center shadow-md ${
                      index < currentStepIndex 
                        ? 'bg-primary text-white' 
                        : index === currentStepIndex 
                          ? 'bg-gradient-to-br from-primary to-primary-700 text-white' 
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1,
                      transition: { delay: 0.1 * index }
                    }}
                  >
                    {index < currentStepIndex ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="font-medium">{index + 1}</span>
                    )}
                  </motion.div>
                  <motion.span 
                    className="text-xs mt-2 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: 1,
                      transition: { delay: 0.1 * index + 0.2 }
                    }}
                  >
                    {step.label}
                  </motion.span>
                </div>
                
                {/* Connector line with animation */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-2 h-px bg-gray-200 relative">
                    <motion.div 
                      className="absolute inset-0 bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ 
                        width: index < currentStepIndex ? "100%" : "0%",
                        transition: { 
                          duration: 0.5, 
                          ease: "easeInOut",
                          delay: index < currentStepIndex ? 0.3 + (0.1 * index) : 0
                        }
                      }}
                    ></motion.div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4 sm:p-6 bg-muted/10 pb-24">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            variants={itemVariants}
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
        </div>
      </div>
    </motion.div>
  );
};

export default SendMoney;
