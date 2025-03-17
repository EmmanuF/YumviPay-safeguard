
import React from 'react';
import { motion } from 'framer-motion';
import RecipientStep from './RecipientStep';
import PaymentStep from './PaymentStep';
import ConfirmationStep from './ConfirmationStep';
import { SendMoneyStep } from '@/hooks/useSendMoneySteps';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

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
      default:
        console.error('Unknown step:', currentStep);
        return <div>Unknown step: {currentStep}</div>;
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
