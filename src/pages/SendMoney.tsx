import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Recipient } from '@/types/recipient';
import { useRecipients } from '@/hooks/useRecipients';
import { useToast } from '@/hooks/use-toast';
import { createTransaction, simulateKadoWebhook } from '@/services/transactions';
import SendMoneyLayout from '@/components/send-money/SendMoneyLayout';
import AmountStep from '@/components/send-money/AmountStep';
import PaymentStep from '@/components/send-money/PaymentStep';
import ConfirmationStep from '@/components/send-money/ConfirmationStep';
import { hasCompletedOnboarding } from '@/services/auth';

interface LocationState {
  selectedRecipient?: Recipient;
}

const SendMoney = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { updateLastUsed } = useRecipients();
  const { selectedRecipient } = (location.state as LocationState) || {};
  
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('CM'); // Set Cameroon as default country
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user has completed onboarding
  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await hasCompletedOnboarding();
      if (!completed) {
        // Redirect to onboarding if not completed
        navigate('/onboarding');
      }
    };
    
    checkOnboarding();
  }, [navigate]);

  // If a recipient is passed via location state, pre-fill the form
  useEffect(() => {
    if (selectedRecipient) {
      setRecipient(selectedRecipient.contact);
      setRecipientId(selectedRecipient.id);
      setRecipientName(selectedRecipient.name);
      setSelectedCountry(selectedRecipient.country);
    }
  }, [selectedRecipient]);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConfirmTransaction = async () => {
    if (!selectedRecipient && !recipientId) {
      toast({
        title: "Recipient required",
        description: "Please select a recipient for this transaction",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Update recipient's last used timestamp
      if (recipientId) {
        await updateLastUsed(recipientId);
      }
      
      // Create transaction in our system - now synchronous
      const transaction = createTransaction(
        amount,
        {
          id: recipientId || 'temp-id',
          name: recipientName,
          contact: recipient,
          country: selectedCountry,
          isFavorite: false
        },
        selectedPaymentMethod,
        selectedProvider
      );

      // Simulate redirect to Kado for KYC & payment
      toast({
        title: "Redirecting to Kado",
        description: "You'll be redirected to complete KYC and payment"
      });

      // Simulate Kado webhook callback after 3 seconds
      await simulateKadoWebhook(transaction.id);
      
      // Navigate to transaction status page
      navigate(`/transaction/${transaction.id}`);
    } catch (error) {
      console.error('Transaction error:', error);
      toast({
        title: "Transaction failed",
        description: "There was an error processing your transaction",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepTitle = () => {
    switch (step) {
      case 1: return "Send Money";
      case 2: return "Payment Method";
      case 3: return "Confirm Transfer";
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
      case 3:
        return (
          <ConfirmationStep
            amount={amount}
            selectedCountry={selectedCountry}
            recipient={recipient}
            recipientName={recipientName}
            selectedPaymentMethod={selectedPaymentMethod}
            selectedProvider={selectedProvider}
            onConfirm={handleConfirmTransaction}
            onBack={handleBack}
            isSubmitting={isSubmitting}
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
