
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { setTransactionAmount, setTransactionData } from '@/utils/transactionDataStore';

export interface TransactionContinueOptions {
  sendAmount: string;
  receiveAmount: string;
  sourceCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
  onContinue?: () => void;
}

export const useTransactionContinue = ({
  sendAmount,
  receiveAmount,
  sourceCurrency,
  targetCurrency,
  exchangeRate,
  onContinue
}: TransactionContinueOptions) => {
  const navigate = useNavigate();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleContinue = () => {
    // Debug the continue action
    console.log('handleContinue called in useTransactionContinue', { 
      isProcessing, 
      authLoading, 
      onContinue,
      isLoggedIn,
      sendAmount,
      receiveAmount
    });
    
    // Prevent multiple clicks
    if (isProcessing || authLoading) {
      console.log('Prevented continuation due to processing or loading state');
      return;
    }
    
    setIsProcessing(true);
    
    // Validate amount
    const amountValue = parseFloat(sendAmount);
    if (!amountValue || amountValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to send.",
        variant: "destructive"
      });
      setIsProcessing(false);
      console.log('Invalid amount, preventing continuation');
      return;
    }
    
    // Ensure we have a proper receive amount (convert string with commas to number)
    const cleanedReceiveAmount = receiveAmount.replace(/,/g, '');
    const receiveAmountValue = parseFloat(cleanedReceiveAmount);
    
    // Store all the transaction data in our centralized store
    try {
      console.log('Setting transaction data with:', {
        amount: amountValue,
        convertedAmount: receiveAmountValue,
        sourceCurrency,
        targetCurrency,
        exchangeRate
      });
      
      // First, clear any old transaction data
      localStorage.removeItem('pendingTransaction');
      localStorage.removeItem('pendingTransactionBackup');
      localStorage.removeItem('processedPendingTransaction');
      
      // Set transaction amount separately for redundancy
      setTransactionAmount(amountValue);
      
      // Set complete transaction data 
      setTransactionData({
        amount: amountValue,
        convertedAmount: receiveAmountValue,
        sourceCurrency,
        targetCurrency,
        exchangeRate
      });
      
      // Wait to ensure the localStorage write completes
      setTimeout(() => {
        if (onContinue) {
          console.log('Calling onContinue callback directly with amount:', amountValue);
          // If we're in inline mode, call the onContinue callback
          onContinue();
        } else if (isLoggedIn) {
          console.log('User is logged in, navigating directly to /send with amount:', amountValue);
          navigate('/send');
        } else {
          console.log('User is not logged in, navigating to signin with redirect and amount:', amountValue);
          navigate('/signin', { state: { redirectTo: '/send' } });
        }
        
        // Reset processing state after a slight delay to give navigation time
        setTimeout(() => {
          setIsProcessing(false);
        }, 200);
      }, 100);
    } catch (error) {
      console.error('Error in handleContinue:', error);
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "An error occurred while processing your request. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    handleContinue,
    isProcessing,
    authLoading
  };
};
