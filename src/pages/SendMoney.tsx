
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Recipient } from '@/types/recipient';
import SendMoneyLayout from '@/components/send-money/SendMoneyLayout';
import AmountStep from '@/components/send-money/AmountStep';
import PaymentStep from '@/components/send-money/PaymentStep';

interface LocationState {
  selectedRecipient?: Recipient;
}

const SendMoney = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedRecipient } = (location.state as LocationState) || {};
  
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('CM'); // Set Cameroon as default country
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  // If a recipient is passed via location state, pre-fill the form
  useEffect(() => {
    if (selectedRecipient) {
      setRecipient(selectedRecipient.contact);
      setRecipientName(selectedRecipient.name);
      setSelectedCountry(selectedRecipient.country);
    }
  }, [selectedRecipient]);

  const handleNext = () => {
    if (step < 2) {
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
      case 2: return "Payment Method";
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
          <PaymentStep
            amount={amount}
            selectedCountry={selectedCountry}
            recipient={recipient}
            recipientName={recipientName}
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
