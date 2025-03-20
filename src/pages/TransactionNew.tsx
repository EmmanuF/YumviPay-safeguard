
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import MobileAppLayout from '@/components/MobileAppLayout';
import LoadingState from '@/components/transaction/LoadingState';
import { useKado } from '@/services/kado/useKado';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const TransactionNew: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { redirectToKadoAndReturn } = useKado();
  const [isLoading, setIsLoading] = useState(true);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Get pending transaction from local storage
  useEffect(() => {
    const getPendingTransaction = async () => {
      try {
        // Try to get the processed transaction data
        const processedPendingTransaction = localStorage.getItem('processedPendingTransaction');
        const pendingTransaction = processedPendingTransaction || localStorage.getItem('pendingTransaction');
        
        if (!pendingTransaction) {
          setError('No transaction data found. Please try again.');
          return;
        }
        
        const data = JSON.parse(pendingTransaction);
        console.log('Transaction data found:', data);
        setTransactionData(data);
        
        // Generate a transaction ID
        const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Get user details
        if (!user || !user.id) {
          setError('User not authenticated. Please sign in and try again.');
          return;
        }
        
        // Save transaction to Supabase
        const { error: saveError } = await supabase
          .from('transactions')
          .insert({
            id: transactionId,
            user_id: user.id,
            amount: data.amount,
            currency: data.sourceCurrency,
            target_currency: data.targetCurrency,
            exchange_rate: data.exchangeRate,
            status: 'pending',
            created_at: new Date().toISOString()
          });
          
        if (saveError) {
          console.error('Error saving transaction:', saveError);
          throw saveError;
        }
        
        // Clear localStorage
        localStorage.removeItem('pendingTransaction');
        localStorage.removeItem('processedPendingTransaction');
        
        // Redirect to Kado
        await redirectToKadoAndReturn({
          amount: data.amount.toString(),
          recipientName: "Recipient", // This should be retrieved from the form or user input
          recipientContact: "recipient@example.com", // This should be retrieved from the form
          country: "CM", // Default to Cameroon for MVP
          paymentMethod: "mobile_money", // Default to mobile money
          transactionId: transactionId
        });
        
      } catch (error) {
        console.error('Error processing transaction:', error);
        setError('An error occurred while processing your transaction. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    getPendingTransaction();
  }, [navigate, redirectToKadoAndReturn, user]);
  
  // Handle retry
  const handleRetry = () => {
    navigate('/send');
  };
  
  // If still loading, show loading state
  if (isLoading) {
    return (
      <LoadingState
        message="Processing your transaction"
        submessage="Please wait while we redirect you to our payment partner"
      />
    );
  }
  
  // If error occurred, show error state
  if (error) {
    return (
      <MobileAppLayout>
        <Helmet>
          <title>Transaction Error | Yumvi-Pay</title>
        </Helmet>
        <div className="flex-1 flex flex-col justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h1 className="text-xl font-bold text-red-600 mb-2">Transaction Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </MobileAppLayout>
    );
  }
  
  // If no data, redirect to send page
  if (!transactionData) {
    useEffect(() => {
      toast({
        title: "Missing transaction data",
        description: "Please start a new transaction",
        variant: "destructive"
      });
      navigate('/send');
    }, []);
    
    return null;
  }
  
  // Default return - should rarely be seen as we either show loading, error, or redirect
  return (
    <LoadingState
      message="Redirecting to payment partner"
      submessage="You will be taken to our secure payment provider momentarily"
    />
  );
};

export default TransactionNew;
