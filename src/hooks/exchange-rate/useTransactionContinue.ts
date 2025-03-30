
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UseTransactionContinueProps {
  sendAmount: string;
  receiveAmount: string;
  sourceCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
  onContinue?: (data: {
    sendAmount: string;
    receiveAmount: string;
    sourceCurrency: string;
    targetCurrency: string;
    exchangeRate: number;
  }) => void;
}

export const useTransactionContinue = ({
  sendAmount,
  receiveAmount,
  sourceCurrency,
  targetCurrency,
  exchangeRate,
  onContinue
}: UseTransactionContinueProps) => {
  const navigate = useNavigate();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleContinue = async () => {
    try {
      setIsProcessing(true);
      console.log("Continue button clicked, processing transaction...");
      
      // Store transaction data in localStorage
      const transactionData = {
        amount: parseFloat(sendAmount) || 0,
        sendAmount,
        receiveAmount,
        sourceCurrency,
        targetCurrency,
        exchangeRate,
        convertedAmount: parseFloat(receiveAmount) || 0,
        targetCountry: targetCurrency === "XAF" ? "CM" : "NG", // Default to Cameroon for XAF
      };
      
      localStorage.setItem('pendingTransaction', JSON.stringify(transactionData));
      console.log("Transaction data stored in localStorage:", transactionData);
      
      // If there's a custom onContinue handler, use it
      if (onContinue) {
        onContinue({
          sendAmount,
          receiveAmount,
          sourceCurrency,
          targetCurrency,
          exchangeRate
        });
        return;
      }
      
      // Otherwise use the default navigation behavior
      if (isLoggedIn) {
        console.log("User is logged in, redirecting to /send");
        navigate('/send');
      } else {
        console.log("User is not logged in, redirecting to /signin");
        navigate('/signin', { state: { redirectAfterLogin: '/send' } });
      }
    } catch (error) {
      console.error("Error during transaction continuation:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleContinue,
    isProcessing,
    authLoading
  };
};
