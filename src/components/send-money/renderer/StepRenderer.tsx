
import React from 'react';
import { motion } from 'framer-motion';
import { SendMoneyStep } from '@/hooks/useSendMoneySteps';
import RecipientStep from '../RecipientStep';
import PaymentStep from '../PaymentStep';
import ConfirmationStep from '../ConfirmationStep';

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
  try {
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
            isSubmitting={isSubmitting}
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
    return null;
  }
};

export default StepRenderer;
