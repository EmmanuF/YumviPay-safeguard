
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

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
    console.log('handleContinue called in useExchangeRateCalculator', { 
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
    
    // Store the current exchange information in localStorage for use in next steps
    const transactionData = {
      sourceCurrency,
      targetCurrency,
      amount: amountValue,
      sendAmount: amountValue.toString(), // Store as sendAmount for consistent naming
      receiveAmount: receiveAmountValue.toString(),
      exchangeRate,
      convertedAmount: receiveAmountValue, // Add explicit convertedAmount field
      timestamp: new Date().toISOString() // Add timestamp for troubleshooting
    };
    
    console.log('Saving transaction data with explicit fields:', transactionData);
    
    try {
      // Clear any old transaction data first to avoid inconsistencies
      localStorage.removeItem('pendingTransaction');
      localStorage.removeItem('pendingTransactionBackup');
      localStorage.removeItem('processedPendingTransaction');
      
      // Save the transaction data to localStorage with redundancy
      localStorage.setItem('pendingTransaction', JSON.stringify(transactionData));
      localStorage.setItem('pendingTransactionBackup', JSON.stringify(transactionData));
      localStorage.setItem('lastTransactionAmount', amountValue.toString());
      
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
