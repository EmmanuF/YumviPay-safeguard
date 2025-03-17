
import React from 'react';
import { motion } from 'framer-motion';
import RecipientStep from './RecipientStep';
import PaymentStep from './PaymentStep';
import ConfirmationStep from './ConfirmationStep';
import { SendMoneyStep } from '@/hooks/useSendMoneySteps';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import LoadingState from '@/components/transaction/LoadingState';

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
  
  // Show loading state if we're submitting
  if (isSubmitting) {
    return <LoadingState message="Processing your request..." submessage="Please wait while we complete this step" />;
  }
  
  // Show error state if there's an error
  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check if we have required transaction data
  if (!transactionData) {
    console.error('Missing transaction data in step renderer');
    return (
      <LoadingState 
        message="Error loading transaction data" 
        submessage="Please try refreshing the page" 
      />
    );
  }

  const renderStep = () => {
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
      return (
        <div className="p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              An error occurred while rendering this step. Please try again.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <button 
              onClick={onBack}
              className="px-4 py-2 bg-gray-200 rounded-md text-gray-800"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {renderStep()}
    </motion.div>
  );
};

export default SendMoneyStepRenderer;
