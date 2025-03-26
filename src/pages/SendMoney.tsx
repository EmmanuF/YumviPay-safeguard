
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { motion } from 'framer-motion';
import { useSendMoneySteps } from '@/hooks/useSendMoneySteps';
import SendMoneyStepRenderer from '@/components/send-money/SendMoneyStepRenderer';
import { Check } from 'lucide-react';

// Define stepper steps
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
      } catch (e) {
        console.error('Error saving transaction data:', e);
      }
      return updated;
    });
  };

  // Get current step index
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title="Send Money" showBackButton onBackClick={handleBack} />
      
      {/* Stepper component */}
      <div className="bg-white shadow-sm">
        <div className="container px-4 py-4">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                {/* Step circle */}
                <div className="flex flex-col items-center">
                  <div 
                    className={`rounded-full w-8 h-8 flex items-center justify-center ${
                      index < currentStepIndex 
                        ? 'bg-primary text-white' 
                        : index === currentStepIndex 
                          ? 'bg-secondary text-white' 
                          : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index < currentStepIndex ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className="text-xs mt-1 text-gray-600">{step.label}</span>
                </div>
                
                {/* Connector line (except after last step) */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-1 h-px bg-gray-300 relative">
                    <div 
                      className="absolute inset-0 bg-primary transition-all duration-300 ease-in-out"
                      style={{ 
                        width: index < currentStepIndex ? '100%' : '0%',
                        opacity: index < currentStepIndex ? 1 : 0.3
                      }}
                    ></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4 bg-muted/30">
        <div className="container mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default SendMoney;
