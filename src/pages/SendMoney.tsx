
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { useSendMoneySteps } from '@/hooks/useSendMoneySteps';
import SendMoneyStepRenderer from '@/components/send-money/SendMoneyStepRenderer';
import { Check, ChevronRight } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
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

  // Get current step index
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  
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

  // Calculate bottom padding for the main content area to accommodate the fixed buttons on mobile
  const contentPaddingClass = isMobile ? 'pb-28' : 'pb-8';

  return (
    <motion.div 
      className="flex flex-col min-h-screen bg-gradient-to-br from-background to-muted/40"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Header title="Send Money" showBackButton onBackClick={handleBack} />
      
      {/* Enhanced Stepper component with animations - fixed position at the top */}
      <div className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-100">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30"></div>
        
        <div className={`${isMobile ? 'px-4 py-3' : 'container px-4 py-4'}`}>
          <div className="flex justify-between items-center mb-2">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                {/* Step circle with enhanced styling */}
                <div className="flex flex-col items-center relative">
                  <motion.div 
                    className={`rounded-full ${isMobile ? 'w-8 h-8 text-xs' : 'w-10 h-10'} flex items-center justify-center shadow-md ${
                      index < currentStepIndex 
                        ? 'bg-green-500 text-white' 
                        : index === currentStepIndex 
                          ? 'bg-gradient-to-br from-primary to-primary-700 text-white font-bold ring-4 ring-primary/20' 
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
                      <Check className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </motion.div>
                  <motion.span 
                    className={`${isMobile ? 'text-xs mt-1' : 'text-xs mt-2'} ${
                      index === currentStepIndex ? 'font-bold text-primary-700' : 'font-medium text-gray-600'
                    }`}
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
                  <div className={`flex-1 ${isMobile ? 'mx-1' : 'mx-2'} h-px bg-gray-200 relative`}>
                    <motion.div 
                      className={`absolute inset-0 ${index < currentStepIndex ? 'bg-green-500' : 'bg-primary'}`}
                      initial={{ width: "0%" }}
                      animate={{ 
                        width: index < currentStepIndex ? "100%" : index === currentStepIndex ? `${progressPercentage}%` : "0%",
                        transition: { 
                          duration: index < currentStepIndex ? 0.5 : 0.8, 
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
          
          {/* New animated progress bar that shows overall completion */}
          <div className="w-full mt-2">
            <Progress value={progressPercentage} className="h-1.5 bg-gray-100">
              <motion.div 
                className="h-full bg-gradient-to-r from-green-400 via-primary to-primary-600"
                style={{ width: `${progressPercentage}%` }}
                animate={{ 
                  width: `${progressPercentage}%`,
                  transition: { 
                    duration: 0.8, 
                    ease: "easeInOut"
                  }
                }}
              />
            </Progress>
          </div>
        </div>
      </div>
      
      <div className={`flex-1 ${isMobile ? 'p-0' : 'p-4 sm:p-6'} bg-muted/10 ${contentPaddingClass}`}>
        <div className={`${isMobile ? 'w-full' : 'container mx-auto max-w-3xl'}`}>
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
