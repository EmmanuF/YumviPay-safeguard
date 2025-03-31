
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendMoneyStep } from '@/hooks/useSendMoneySteps';
import RecipientStep from '../RecipientStep';
import PaymentStep from '../PaymentStep';
import ConfirmationStep from '../ConfirmationStep';
import { useDeviceOptimizations } from '@/hooks/useDeviceOptimizations';
import { toast } from '@/hooks/use-toast';
import { useNetwork } from '@/contexts/NetworkContext';
import PaymentLoadingState from '../payment/PaymentLoadingState';
import { isPlatform } from '@/utils/platformUtils';

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
  const { isOffline } = useNetwork();
  const isNative = isPlatform('capacitor');
  
  // Animation variants for each step - optimized based on device capabilities
  const stepVariants = {
    hidden: { 
      opacity: 0, 
      x: 20,
      transition: {
        duration: animationSettings.duration,
      }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: animationSettings.duration,
        ease: animationSettings.complexity === 'simple' ? 'easeOut' : 'easeInOut'
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: {
        duration: animationSettings.duration,
        ease: animationSettings.complexity === 'simple' ? 'easeIn' : 'easeInOut'
      }
    }
  };
  
  // On native devices, trigger haptic feedback on step changes
  useEffect(() => {
    const triggerHapticFeedback = async () => {
      if (isNative) {
        try {
          const { Haptics } = await import('@capacitor/haptics');
          await Haptics.impact({ style: 'light' });
        } catch (error) {
          console.error('Error triggering haptics:', error);
        }
      }
    };
    
    triggerHapticFeedback();
  }, [currentStep, isNative]);
  
  // If offline and trying to submit, show offline state
  if (isSubmitting && isOffline) {
    return <PaymentLoadingState isOffline={true} onRetry={onNext} />;
  }
  
  // If submitting, show loading state
  if (isSubmitting) {
    return (
      <PaymentLoadingState 
        loadingType="processing"
        message="Processing your transaction..." 
      />
    );
  }
  
  try {
    switch (currentStep) {
      case 'recipient':
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="recipient"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <RecipientStep
                transactionData={transactionData}
                updateTransactionData={updateTransactionData}
                onNext={onNext}
                onBack={onBack}
              />
            </motion.div>
          </AnimatePresence>
        );
      case 'payment':
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="payment"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <PaymentStep
                transactionData={transactionData}
                updateTransactionData={updateTransactionData}
                onNext={onNext}
                onBack={onBack}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          </AnimatePresence>
        );
      case 'confirmation':
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="confirmation"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <ConfirmationStep
                transactionData={transactionData}
                onConfirm={onNext}
                onBack={onBack}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          </AnimatePresence>
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
    
    return (
      <PaymentLoadingState
        error={`Error rendering step: ${e instanceof Error ? e.message : String(e)}`}
        onRetry={onBack}
      />
    );
  }
};

export default StepRenderer;
