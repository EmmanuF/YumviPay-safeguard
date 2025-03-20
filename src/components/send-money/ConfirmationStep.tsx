
import React from 'react';
import { TransactionData } from '@/hooks/useSendMoneyTransaction';
import TransactionSummary from './TransactionSummary';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';

interface ConfirmationStepProps {
  transactionData: TransactionData;
  onConfirm: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  transactionData,
  onConfirm,
  onBack,
  isSubmitting
}) => {
  const handleConfirm = () => {
    // Save complete transaction data to localStorage before final confirmation
    try {
      const completeData = {
        ...transactionData,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('processedPendingTransaction', JSON.stringify(completeData));
      console.log('Saved complete transaction data before confirmation:', completeData);
      
      // Proceed with confirmation
      onConfirm();
    } catch (error) {
      console.error('Error saving transaction data:', error);
      // Still proceed with confirmation even if saving fails
      onConfirm();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center mb-4">Confirm Your Transfer</h2>
      
      <TransactionSummary 
        amount={transactionData.amount.toString()}
        recipientName={transactionData.recipientName}
        recipient={transactionData.recipient || undefined}
        selectedCountryData={undefined}
        selectedCountry={transactionData.targetCountry}
        selectedPaymentMethod={transactionData.paymentMethod}
        selectedProvider={transactionData.selectedProvider}
      />
      
      <div className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
        <p>
          By confirming this transfer, you agree to our terms and conditions. 
          The recipient will be notified when the funds are available.
        </p>
      </div>
      
      <div className="flex flex-col space-y-4 pt-4">
        <Button 
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3"
        >
          {isSubmitting ? 'Processing...' : 'Confirm Transfer'}
          {!isSubmitting && <Check className="ml-2 h-5 w-5" />}
        </Button>
        
        <Button
          onClick={onBack}
          disabled={isSubmitting}
          variant="outline"
          className="w-full"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
