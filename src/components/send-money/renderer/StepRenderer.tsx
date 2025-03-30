
import React from 'react';
import { motion } from 'framer-motion';
import { SendMoneyStep } from '@/hooks/useSendMoneySteps';
import RecipientStep from '../RecipientStep';
import PaymentStep from '../PaymentStep';
import ConfirmationStep from '../ConfirmationStep';
import { useDeviceOptimizations } from '@/hooks/useDeviceOptimizations';
import { toast } from '@/hooks/use-toast';

interface StepRendererProps {
  currentStep: SendMoneyStep;
  transactionData: any;
  updateTransactionData: (data: Partial<any>) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const StepRenderer: React.FC<StepRendererProps> = ({
  currentStep,
  transactionData,
  updateTransactionData,
  onNext,
  onBack,
  isSubmitting
}) => {
  const { getOptimizedAnimationSettings } = useDeviceOptimizations();
  const animationSettings = getOptimizedAnimationSettings();
  
  // Animation variants for each step
  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: animationSettings.duration,
        ease: "easeInOut"
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: {
        duration: animationSettings.duration,
        ease: "easeInOut"
      }
    }
  };
  
  try {
    switch (currentStep) {
      case 'recipient':
        return (
          <motion.div
            key="recipient"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <RecipientStep
              transactionData={transactionData}
              updateTransactionData={updateTransactionData}
              onNext={onNext}
              onBack={onBack}
            />
          </motion.div>
        );
      case 'payment':
        return (
          <motion.div
            key="payment"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <PaymentStep
              transactionData={transactionData}
              updateTransactionData={updateTransactionData}
              onNext={onNext}
              onBack={onBack}
              isSubmitting={isSubmitting}
            />
          </motion.div>
        );
      case 'confirmation':
        return (
          <motion.div
            key="confirmation"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ConfirmationStep
              transactionData={transactionData}
              onConfirm={onNext}
              onBack={onBack}
              isSubmitting={isSubmitting}
            />
          </motion.div>
        );
      default:
        console.error('Unknown step:', currentStep);
        toast({
          title: "Error",
          description: `Unknown step: ${currentStep}`,
          variant: "destructive",
        });
        
        return (
          <div className="p-4 text-center">
            <p>Unknown step: {currentStep}</p>
            <button 
              onClick={onBack}
              className="mt-4 px-4 py-2 bg-primary rounded-md text-white"
            >
              Go Back
            </button>
          </div>
        );
    }
  } catch (e) {
    console.error('Error rendering step:', e);
    toast({
      title: "Error",
      description: `Error rendering step: ${e instanceof Error ? e.message : String(e)}`,
      variant: "destructive",
    });
    return null;
  }
};

export default StepRenderer;
