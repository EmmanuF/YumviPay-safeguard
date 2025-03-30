
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { TransactionContinueProps } from './types';
import { useToast } from '@/hooks/use-toast';

export const useTransactionContinue = ({
  sendAmount,
  receiveAmount,
  sourceCurrency,
  targetCurrency,
  exchangeRate,
  onContinue
}: TransactionContinueProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // Handle continue button click
  const handleContinue = () => {
    console.log("Continue transaction flow", { isLoggedIn, authLoading });
    
    if (!sendAmount || parseFloat(sendAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to send",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    console.log("Processing transaction...");
    
    try {
      // Store transaction data in localStorage
      const transactionData = {
        amount: parseFloat(sendAmount) || 0,
        sendAmount,
        receiveAmount,
        sourceCurrency,
        targetCurrency,
        exchangeRate,
        convertedAmount: parseFloat(receiveAmount) || 0,
      };
      
      localStorage.setItem('pendingTransaction', JSON.stringify(transactionData));
      console.log("Transaction data stored:", transactionData);
      
      // If custom continuation handler provided, use it
      if (onContinue) {
        onContinue({
          sendAmount,
          receiveAmount, 
          sourceCurrency,
          targetCurrency,
          exchangeRate
        });
      }
      
    } catch (error) {
      console.error("Error processing transaction continuation:", error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
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
