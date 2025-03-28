
import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import SendMoneyStepRenderer from '@/components/send-money/SendMoneyStepRenderer';
import { SendMoneyStep } from '@/hooks/useSendMoneySteps';

interface SendMoneyContentProps {
  currentStep: SendMoneyStep;
  transactionData: any;
  updateTransactionData: (data: Partial<any>) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  error: string | null;
}

const SendMoneyContent: React.FC<SendMoneyContentProps> = ({
  currentStep,
  transactionData,
  updateTransactionData,
  onNext,
  onBack,
  isSubmitting,
  error
}) => {
  const isMobile = useIsMobile();
  
  // Calculate bottom padding for the main content area to accommodate the fixed buttons on mobile
  const contentPaddingClass = isMobile ? 'pb-28' : 'pb-8';
  
  // Animation variants
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

  return (
    <div className={`flex-1 ${isMobile ? 'p-0' : 'p-4 sm:p-6'} bg-muted/10 ${contentPaddingClass} mt-progress-bar`}>
      <div className={`${isMobile ? 'w-full' : 'container mx-auto max-w-3xl'}`}>
        <motion.div
          variants={itemVariants}
          className="w-full"
        >
          <SendMoneyStepRenderer
            currentStep={currentStep}
            transactionData={transactionData}
            updateTransactionData={updateTransactionData}
            onNext={onNext}
            onBack={onBack}
            isSubmitting={isSubmitting}
            error={error}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SendMoneyContent;
