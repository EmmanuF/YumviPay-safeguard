
import React from 'react';
import { motion } from 'framer-motion';
import RecipientStep, { RecipientStepProps } from './RecipientStep';
import PaymentStep, { PaymentStepProps } from './PaymentStep';
import ConfirmationStep, { ConfirmationStepProps } from './ConfirmationStep';
import { SendMoneyStep } from '@/hooks/useSendMoneySteps';

interface SendMoneyStepRendererProps {
  currentStep: SendMoneyStep;
  transactionData: any;
  updateTransactionData: (data: Partial<any>) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const SendMoneyStepRenderer: React.FC<SendMoneyStepRendererProps> = ({
  currentStep,
  transactionData,
  updateTransactionData,
  onNext,
  onBack,
  isSubmitting
}) => {
  const renderStep = () => {
    switch (currentStep) {
      case 'recipient':
        return (
          <RecipientStep
            transactionData={transactionData}
            updateTransactionData={updateTransactionData}
            onNext={onNext}
            onBack={onBack}
          />
        );
      case 'payment':
        return (
          <PaymentStep
            transactionData={transactionData}
            updateTransactionData={updateTransactionData}
            onNext={onNext}
            onBack={onBack}
          />
        );
      case 'confirmation':
        return (
          <ConfirmationStep
            transactionData={transactionData}
            onConfirm={onNext}
            onBack={onBack}
            isSubmitting={isSubmitting}
          />
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {renderStep()}
    </motion.div>
  );
};

export default SendMoneyStepRenderer;
