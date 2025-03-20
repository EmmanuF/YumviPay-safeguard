
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
        console.log('Starting transaction processing...');
        // Try to get the processed transaction data
        const processedPendingTransaction = localStorage.getItem('processedPendingTransaction');
        const pendingTransaction = processedPendingTransaction || localStorage.getItem('pendingTransaction');
        
        // Debug log to check what data we have
        console.log('Found transaction data in localStorage:', !!pendingTransaction);
        
        if (!pendingTransaction) {
          console.error('No transaction data found in localStorage');
          setError('No transaction data found. Please try again.');
          setIsLoading(false);
          return;
        }
        
        // Parse the transaction data and perform additional validation
        let data;
        try {
          data = JSON.parse(pendingTransaction);
          console.log('Successfully parsed transaction data:', data);
          
          // Validate required fields
          if (!data.amount || isNaN(parseFloat(data.amount))) {
            throw new Error('Invalid transaction amount');
          }
          
          setTransactionData(data);
        } catch (parseError) {
          console.error('Error parsing transaction data:', parseError);
          setError('Invalid transaction data. Please try again.');
          setIsLoading(false);
          return;
        }
        
        // Generate a transaction ID for reference
        const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Get user details
        if (!user || !user.id) {
          setError('User not authenticated. Please sign in and try again.');
          setIsLoading(false);
          return;
        }
        
        console.log('Saving transaction to Supabase for user:', user.id);
        
        // Save transaction to Supabase
        // Make sure we only use fields that exist in the transactions table
        const { data: savedTransaction, error: saveError } = await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            amount: data.amount,
            // Instead of 'currency', use an existing field or store currency info in a different way
            // For example, we could store it in the provider field or total_amount field temporarily
            total_amount: data.sourceCurrency, // Store source currency here temporarily
            status: 'pending',
            country: 'CM', // Default to Cameroon for MVP
            recipient_name: data.recipientName || "Recipient" // Use provided recipient name or default
          })
          .select()
          .single();
          
        if (saveError) {
          console.error('Error saving transaction:', saveError);
          setError('Failed to save transaction. Please try again.');
          setIsLoading(false);
          return;
        }
        
        console.log('Transaction saved successfully:', savedTransaction);
        
        // Clear localStorage
        localStorage.removeItem('pendingTransaction');
        localStorage.removeItem('processedPendingTransaction');
        
        console.log('Redirecting to Kado...');
        
        // Redirect to Kado with the real transaction ID from Supabase
        await redirectToKadoAndReturn({
          amount: data.amount.toString(),
          recipientName: data.recipientName || "Recipient",
          recipientContact: data.recipientContact || "recipient@example.com",
          country: "CM", // Default to Cameroon for MVP
          paymentMethod: data.paymentMethod || "mobile_money",
          transactionId: savedTransaction.id.toString()
        });
        
      } catch (error) {
        console.error('Unexpected error processing transaction:', error);
        setError('An error occurred while processing your transaction. Please try again.');
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
  
  // If no data, redirect to send page, but only after loading is complete
  if (!transactionData && !isLoading) {
    // Use a separate useEffect to handle navigation after render
    useEffect(() => {
      toast({
        title: "Missing transaction data",
        description: "Please start a new transaction",
        variant: "destructive"
      });
      navigate('/send');
    }, []);
    
    return (
      <LoadingState
        message="Redirecting"
        submessage="Please wait while we redirect you"
      />
    );
  }
  
  // Default return - showing loading state while we process everything
  return (
    <LoadingState
      message="Redirecting to payment partner"
      submessage="You will be taken to our secure payment provider momentarily"
    />
  );
};

export default TransactionNew;
