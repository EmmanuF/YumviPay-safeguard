
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SendMoneyLayout from '@/components/send-money/SendMoneyLayout';
import AmountStep from '@/components/send-money/AmountStep';
import RecipientStep from '@/components/send-money/RecipientStep';
import PaymentStep from '@/components/send-money/PaymentStep';

const SendMoney = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('CM'); // Set Cameroon as default country
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Generate a random transaction ID for demo purposes
      const transactionId = Math.random().toString(36).substring(2, 10);
      navigate(`/transaction/${transactionId}`);
    }
  };

  const renderStepTitle = () => {
    switch (step) {
      case 1: return "Send Money";
      case 2: return "Recipient";
      case 3: return "Payment Method";
      default: return "Send Money";
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <AmountStep
            amount={amount}
            setAmount={setAmount}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <RecipientStep
            recipient={recipient}
            setRecipient={setRecipient}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <PaymentStep
            amount={amount}
            selectedCountry={selectedCountry}
            recipient={recipient}
            selectedPaymentMethod={selectedPaymentMethod}
            onSelectPaymentMethod={setSelectedPaymentMethod}
            onNext={handleNext}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SendMoneyLayout title={renderStepTitle()}>
      {renderStepContent()}
    </SendMoneyLayout>
  );
};

export default SendMoney;
