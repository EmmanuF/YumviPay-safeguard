
import React, { useEffect } from 'react';
import PageTransition from '@/components/PageTransition';
import SendMoneyLayout from '@/components/send-money/SendMoneyLayout';
import SendMoneyStepRenderer from '@/components/send-money/SendMoneyStepRenderer';
import BottomNavigation from '@/components/BottomNavigation';
import InitialDataCalculator from '@/components/send-money/InitialDataCalculator';
import LoadingState from '@/components/transaction/LoadingState';
import { useSendMoneySteps } from '@/hooks/useSendMoneySteps';
import { useSendMoneyTransaction } from '@/hooks/useSendMoneyTransaction';
import { useNetwork } from '@/contexts/NetworkContext';
import { WifiOff } from 'lucide-react';

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
  const { isOffline, offlineModeActive } = useNetwork();
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
      isOffline,
      offlineModeActive
    });
  }, [isLoading, needsInitialData, error, transactionError, isInitialized, currentStep, isOffline, offlineModeActive]);
  
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

  // Offline indicator
  const OfflineIndicator = () => ((isOffline || offlineModeActive) ? (
    <div className="flex items-center justify-center bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-xs font-medium mb-2">
      <WifiOff className="h-3 w-3 mr-1" />
      <span>Using offline data</span>
    </div>
  ) : null);

  // Show loading state if necessary
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
            <OfflineIndicator />
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
          <OfflineIndicator />
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
