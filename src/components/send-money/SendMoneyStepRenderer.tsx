
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { SendMoneyStep } from '@/hooks/useSendMoneySteps';
import LoadingState from '@/components/transaction/LoadingState';
import { useSendMoneyRenderer } from '@/hooks/useSendMoneyRenderer';
import { recoverTransactionData } from '@/utils/transactionDataRecovery';
import ErrorState from './renderer/ErrorState';
import RecoveryState from './renderer/RecoveryState';
import StepRenderer from './renderer/StepRenderer';
import { useDeviceOptimizations } from '@/hooks/useDeviceOptimizations';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface SendMoneyStepRendererProps {
  currentStep: SendMoneyStep;
  transactionData: any;
  updateTransactionData: (data: Partial<any>) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  error?: string | null;
}

const SendMoneyStepRenderer: React.FC<SendMoneyStepRendererProps> = ({
  currentStep,
  transactionData,
  updateTransactionData,
  onNext,
  onBack,
  isSubmitting,
  error
}) => {
  console.log('Rendering step:', currentStep, 'with data:', transactionData);
  
  const isMobile = useIsMobile();
  const { getOptimizedAnimationSettings } = useDeviceOptimizations();
  const animationSettings = getOptimizedAnimationSettings();
  
  // Use the extracted hook for transaction data management
  const { cachedDataRef } = useSendMoneyRenderer({
    currentStep,
    transactionData,
    updateTransactionData
  });

  // Show any errors as toasts for better UX
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  // Show loading state if we're submitting
  if (isSubmitting) {
    return (
      <LoadingState 
        message="Processing your request..." 
        submessage="Please wait while we complete this step"
        transactionId={transactionData?.id || transactionData?.transactionId}
        timeout={500} // Very short timeout during step processing
      />
    );
  }
  
  // Show error state if there's an error
  if (error) {
    return <ErrorState error={error} onBack={onBack} />;
  }

  // Check if we have required transaction data
  if (!transactionData) {
    console.error('Missing transaction data in step renderer');
    
    // Try to recover data with the utility function
    const { recovered } = recoverTransactionData(currentStep, updateTransactionData, cachedDataRef);
    
    if (recovered) {
      return <RecoveryState />;
    }
    
    return (
      <LoadingState 
        message="Error loading transaction data" 
        submessage="Please try refreshing the page" 
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: animationSettings.duration,
        ease: "easeInOut"
      }}
      className={`w-full ${isMobile ? 'px-4' : ''}`}
    >
      <StepRenderer
        currentStep={currentStep}
        transactionData={transactionData}
        updateTransactionData={updateTransactionData}
        onNext={onNext}
        onBack={onBack}
        isSubmitting={isSubmitting}
      />
    </motion.div>
  );
};

export default SendMoneyStepRenderer;
