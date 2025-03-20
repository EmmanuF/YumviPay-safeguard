
import React, { useEffect } from 'react';
import PageTransition from '@/components/PageTransition';
import SendMoneyLayout from '@/components/send-money/SendMoneyLayout';
import SendMoneyStepRenderer from '@/components/send-money/SendMoneyStepRenderer';
import BottomNavigation from '@/components/BottomNavigation';
import InitialDataCalculator from '@/components/send-money/InitialDataCalculator';
import LoadingState from '@/components/transaction/LoadingState';
import { useSendMoneySteps } from '@/hooks/useSendMoneySteps';
import { useSendMoneyTransaction, TransactionData } from '@/hooks/useSendMoneyTransaction';

interface SendMoneyContainerProps {
  isLoading: boolean;
  needsInitialData: boolean;
  error?: string | Error | null;
  defaultCountryCode: string;
  onInitialDataContinue: () => void;
}

const SendMoneyContainer: React.FC<SendMoneyContainerProps> = ({
  isLoading,
  needsInitialData,
  error,
  defaultCountryCode,
  onInitialDataContinue
}) => {
  const { transactionData, updateTransactionData, isInitialized, error: transactionError } = 
    useSendMoneyTransaction(defaultCountryCode);
  
  // Get step management
  const { currentStep, isSubmitting, error: stepError, handleNext, handleBack } = useSendMoneySteps();
  
  // Combined error state
  const combinedError = error || transactionError || stepError;

  // Debug log for component state
  useEffect(() => {
    console.log('SendMoneyContainer rendering with states:', {
      isLoading,
      needsInitialData,
      error: error ? true : false,
      transactionError: transactionError ? true : false,
      isInitialized,
      currentStep,
      transactionData
    });
  }, [isLoading, needsInitialData, error, transactionError, isInitialized, currentStep, transactionData]);
  
  // Save transaction data to localStorage before proceeding to final step
  useEffect(() => {
    if (currentStep === 'confirmation' && !isSubmitting) {
      console.log('Saving completed transaction data to localStorage:', transactionData);
      
      try {
        // Store all the information we'll need for the Kado integration
        localStorage.setItem('processedPendingTransaction', JSON.stringify({
          ...transactionData,
          amount: transactionData.amount,
          sourceCurrency: transactionData.sourceCurrency,
          targetCurrency: transactionData.targetCurrency,
          recipientName: transactionData.recipientName,
          recipientContact: transactionData.recipientContact || 'recipient@example.com',
          paymentMethod: transactionData.paymentMethod || 'mobile_money'
        }));
      } catch (err) {
        console.error('Error saving transaction data to localStorage:', err);
      }
    }
  }, [currentStep, isSubmitting, transactionData]);
  
  // Format error message for display
  const getErrorMessage = (err: string | Error | null): string => {
    if (!err) return "An unexpected error occurred";
    
    if (typeof err === 'string') {
      return err;
    }
    
    if (err instanceof Error) {
      return err.message || "Error processing your transaction";
    }
    
    // If it's an object with a message property
    if (typeof err === 'object' && err !== null && 'message' in err) {
      const message = (err as any).message;
      return typeof message === 'string' ? message : "Error processing your transaction";
    }
    
    return "An unexpected error occurred";
  };

  // Show loading state if necessary
  // Set a maximum loading time of 10 seconds to prevent infinite loading
  if (isLoading && !isInitialized) {
    return <LoadingState 
      message="Preparing your transaction..." 
      submessage="Please wait while we fetch your data"
    />;
  }
  
  // Show error state if necessary
  if (combinedError) {
    return <LoadingState 
      message="Error loading transaction data" 
      submessage={getErrorMessage(combinedError)}
    />;
  }

  // If we need to collect initial data, show the exchange rate calculator
  if (needsInitialData) {
    return (
      <PageTransition>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <SendMoneyLayout 
            currentStep={0} 
            stepCount={4}
            title="Set Transfer Details"
          >
            <InitialDataCalculator onContinue={onInitialDataContinue} />
          </SendMoneyLayout>
          <div className="pb-16"></div>
          <BottomNavigation />
        </div>
      </PageTransition>
    );
  }

  // Render normal send money flow once we have the initial data
  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <SendMoneyLayout 
          currentStep={currentStep} 
          stepCount={3}
        >
          <SendMoneyStepRenderer
            currentStep={currentStep}
            transactionData={transactionData}
            updateTransactionData={updateTransactionData}
            onNext={handleNext}
            onBack={handleBack}
            isSubmitting={isSubmitting}
            error={combinedError ? getErrorMessage(combinedError) : null}
          />
        </SendMoneyLayout>
        <div className="pb-16"></div>
        <BottomNavigation />
      </div>
    </PageTransition>
  );
};

export default SendMoneyContainer;
