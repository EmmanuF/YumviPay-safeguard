
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTransactionById, simulateWebhook } from '@/services/transaction';
import { Transaction as TransactionType } from '@/types/transaction';
import { ArrowLeft, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/currencyFormatter';

const Transaction = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<TransactionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadTransaction = async () => {
      try {
        if (!id) {
          setError('Transaction ID is missing');
          setLoading(false);
          return;
        }
        
        const data = await getTransactionById(id);
        
        if (!data) {
          setError('Transaction not found');
          setLoading(false);
          return;
        }
        
        setTransaction(data);
        
        // If the transaction is pending, simulate a webhook response
        if (data.status === 'pending') {
          simulateWebhook(id);
          
          // Poll for updates
          const intervalId = setInterval(async () => {
            const updatedData = await getTransactionById(id);
            if (updatedData && (updatedData.status === 'completed' || updatedData.status === 'failed')) {
              setTransaction(updatedData);
              clearInterval(intervalId);
            }
          }, 2000);
          
          // Clean up interval
          return () => clearInterval(intervalId);
        }
      } catch (err) {
        console.error('Error loading transaction:', err);
        setError('Failed to load transaction details');
      } finally {
        setLoading(false);
      }
    };
    
    loadTransaction();
  }, [id]);
  
  const renderStatusContent = () => {
    if (!transaction) return null;
    
    switch (transaction.status) {
      case 'pending':
        return (
          <div className="flex flex-col items-center text-center py-6">
            <div className="rounded-full bg-amber-100 p-3 mb-4">
              <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-amber-800 mb-2">Processing Your Payment</h2>
            <p className="text-gray-600 max-w-md">
              Your transaction is being processed. This may take a few moments. Please do not close this page.
            </p>
          </div>
        );
      
      case 'completed':
        return (
          <div className="flex flex-col items-center text-center py-6">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <Check className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-green-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 max-w-md">
              Your money has been sent successfully to {transaction.recipientName}.
            </p>
          </div>
        );
      
      case 'failed':
        return (
          <div className="flex flex-col items-center text-center py-6">
            <div className="rounded-full bg-red-100 p-3 mb-4">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-red-800 mb-2">Payment Failed</h2>
            <p className="text-gray-600 max-w-md">
              {transaction.failureReason || "We couldn't process your payment. Please try again."}
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-10">
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
            <p className="text-center mt-4">Loading transaction details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center">
        <Card className="w-full max-w-md border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent className="py-6">
            <p className="text-center">{error}</p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => navigate('/send-money')} 
              className="w-full"
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Send Money
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (!transaction) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-6">
            <p className="text-center">Transaction not found</p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => navigate('/send-money')} 
              className="w-full"
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Send Money
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10 px-4 flex justify-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className={`
          ${transaction.status === 'completed' ? 'bg-green-50 border-b border-green-100' : 
           transaction.status === 'failed' ? 'bg-red-50 border-b border-red-100' : 
           'bg-amber-50 border-b border-amber-100'}
        `}>
          <CardTitle className="flex items-center justify-between">
            <span>Transaction Details</span>
            <span className={`text-sm font-normal px-2 py-1 rounded ${
              transaction.status === 'completed' ? 'bg-green-200 text-green-800' : 
              transaction.status === 'failed' ? 'bg-red-200 text-red-800' : 
              'bg-amber-200 text-amber-800'
            }`}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="py-6 space-y-6">
          {renderStatusContent()}
          
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="text-sm text-gray-500 font-medium">Transaction Amount</h3>
              <p className="text-xl font-semibold">{formatCurrency(transaction.amount, 'USD')}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h3 className="text-sm text-gray-500 font-medium">Recipient</h3>
                <p className="font-medium">{transaction.recipientName}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h3 className="text-sm text-gray-500 font-medium">Contact</h3>
                <p className="font-medium">{transaction.recipientContact}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h3 className="text-sm text-gray-500 font-medium">Payment Method</h3>
                <p className="font-medium">{transaction.paymentMethod?.replace('_', ' ') || 'Not specified'}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h3 className="text-sm text-gray-500 font-medium">Provider</h3>
                <p className="font-medium">{transaction.provider || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="text-sm text-gray-500 font-medium">Transaction ID</h3>
              <p className="font-mono text-sm">{transaction.id}</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={() => navigate('/send-money')} 
            className={`w-full ${
              transaction.status === 'completed' ? 'bg-green-600 hover:bg-green-700' : 
              transaction.status === 'failed' ? 'bg-red-600 hover:bg-red-700' : 
              'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {transaction.status === 'completed' ? 'Send Money Again' : 
             transaction.status === 'failed' ? 'Try Again' : 
             'Back to Send Money'}
          </Button>
          
          <Button 
            onClick={() => navigate('/')} 
            variant="outline"
            className="w-full"
          >
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Transaction;
