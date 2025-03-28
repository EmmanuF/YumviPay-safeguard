
import React from 'react';
import RecurringPaymentToggle from './RecurringPaymentToggle';

interface RecurringPaymentOptionProps {
  transactionData: any;
  onRecurringChange: (isRecurring: boolean, frequency: string) => void;
}

const RecurringPaymentOption: React.FC<RecurringPaymentOptionProps> = ({
  transactionData,
  onRecurringChange
}) => {
  return (
    <RecurringPaymentToggle 
      isRecurring={transactionData?.isRecurring || false}
      frequency={transactionData?.recurringFrequency || 'monthly'}
      onRecurringChange={onRecurringChange}
    />
  );
};

export default RecurringPaymentOption;
