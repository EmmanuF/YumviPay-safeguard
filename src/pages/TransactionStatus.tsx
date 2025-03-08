
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import TransactionCard from '@/components/TransactionCard';
import StatusUpdateBar from '@/components/transaction/StatusUpdateBar';
import HeaderRight from '@/components/HeaderRight';

interface TransactionDetails {
  id: string;
  status: 'pending' | 'completed' | 'failed';
  amount: string;
  fee: string;
  totalAmount: string;
  recipient: string;
  date: string;
  estimatedDelivery: string;
}

const TransactionStatus = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<TransactionDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API fetch for transaction details
    const fetchTransactionDetails = () => {
      setLoading(true);
      // Mock data - in a real app, this would be fetched from an API
      setTimeout(() => {
        setTransaction({
          id: id || '',
          status: 'completed',
          amount: '250.00',
          fee: '4.99',
          totalAmount: '254.99',
          recipient: '+234 701 234 5678',
          date: new Date().toLocaleDateString(),
          estimatedDelivery: '1-2 business days',
        });
        setLoading(false);
      }, 1000);
    };

    if (id) {
      fetchTransactionDetails();
    }
  }, [id]);

  const handleGoToHome = () => {
    navigate('/dashboard');
  };

  const handleNewTransaction = () => {
    navigate('/send');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header title="Transaction" showBackButton={true} rightContent={<HeaderRight showNotification />} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <Clock className="h-10 w-10 text-primary-500 mx-auto animate-pulse" />
            <p className="mt-4 text-foreground">Loading transaction details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header title="Transaction" showBackButton={true} rightContent={<HeaderRight showNotification />} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-foreground">Transaction not found.</p>
            <Button onClick={handleGoToHome} className="mt-4">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title="Transaction Receipt" showBackButton={true} rightContent={<HeaderRight showNotification />} />
      
      <div className="flex-1 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden">
            <div className="bg-primary-500 p-6 text-center text-white">
              <CheckCircle className="h-12 w-12 mx-auto mb-2" />
              <h2 className="text-xl font-semibold">Money Sent Successfully!</h2>
              <p className="opacity-90 text-sm mt-1">
                Transaction ID: {transaction.id}
              </p>
            </div>
            
            <div className="p-5 space-y-6">
              {/* Status Update Notifications */}
              <div className="mb-4">
                <StatusUpdateBar transactionId={transaction.id} />
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  TRANSACTION DETAILS
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Sent</span>
                    <span className="font-medium">${transaction.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fee</span>
                    <span className="font-medium">${transaction.fee}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold">${transaction.totalAmount}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  RECIPIENT
                </h3>
                <p className="font-medium">{transaction.recipient}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  DELIVERY
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{transaction.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Delivery</span>
                    <span className="font-medium">{transaction.estimatedDelivery}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="mt-6 flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                // In a real app, this would trigger native sharing
                alert('Sharing functionality would be implemented here');
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              className="flex-1"
              onClick={handleNewTransaction}
            >
              New Transaction
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            className="mt-4 w-full"
            onClick={handleGoToHome}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default TransactionStatus;
