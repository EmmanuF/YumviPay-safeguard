
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import MobileAppLayout from '@/components/MobileAppLayout';
import LoadingState from '@/components/transaction/LoadingState';
import TransactionNotFound from '@/components/transaction/TransactionNotFound';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/transaction';

const TransactionStatus: React.FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId) {
        setError('Transaction ID is missing');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching transaction:', transactionId);
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('id', transactionId)
          .single();

        if (error) {
          console.error('Error fetching transaction:', error);
          throw error;
        }

        if (!data) {
          console.log('Transaction not found');
          setTransaction(null);
        } else {
          console.log('Transaction found:', data);
          setTransaction(data as unknown as Transaction);
        }
      } catch (err) {
        console.error('Error in transaction fetch:', err);
        setError('Failed to load transaction details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  if (isLoading) {
    return (
      <LoadingState
        message="Loading transaction details"
        submessage="Please wait while we retrieve your transaction information"
      />
    );
  }

  if (error) {
    return (
      <MobileAppLayout>
        <Helmet>
          <title>Transaction Error | Yumvi-Pay</title>
        </Helmet>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-xl font-bold text-red-600 mb-2">Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </MobileAppLayout>
    );
  }

  if (!transaction) {
    return <TransactionNotFound />;
  }

  return (
    <MobileAppLayout>
      <Helmet>
        <title>Transaction Status | Yumvi-Pay</title>
      </Helmet>
      <div className="flex-1 p-4">
        <h1 className="text-xl font-bold mb-4">Transaction Status</h1>
        
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="font-medium text-lg">Transaction ID: {transaction.id}</h2>
          <p className="text-gray-600">Status: <span className="font-semibold">{transaction.status}</span></p>
          <p className="text-gray-600">Amount: {transaction.amount} {transaction.currency}</p>
          {transaction.recipientName && (
            <p className="text-gray-600">Recipient: {transaction.recipientName}</p>
          )}
          <p className="text-gray-600">Date: {new Date(transaction.createdAt).toLocaleString()}</p>
          
          {transaction.status === 'pending' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-700">
                Your transaction is being processed. This may take a few minutes.
              </p>
            </div>
          )}
          
          {transaction.status === 'completed' && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700">
                Transaction completed successfully!
              </p>
            </div>
          )}
          
          {transaction.status === 'failed' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700">
                Transaction failed: {transaction.failureReason || 'Unknown reason'}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/send')}
            className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600"
          >
            New Transfer
          </button>
        </div>
      </div>
    </MobileAppLayout>
  );
};

export default TransactionStatus;
