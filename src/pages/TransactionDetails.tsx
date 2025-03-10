
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { getTransactionById } from '@/services/transactions';
import { useLocale } from '@/contexts/LocaleContext';
import BottomNavigation from '@/components/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatUtils';

const TransactionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLocale();
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!id) return;
      
      try {
        const data = await getTransactionById(id);
        if (data) {
          setTransaction(data);
        } else {
          toast({
            title: "Transaction not found",
            description: "The transaction you're looking for couldn't be found.",
            variant: "destructive",
          });
          navigate('/history');
        }
      } catch (error) {
        console.error("Error fetching transaction details:", error);
        toast({
          title: "Error",
          description: "Failed to load transaction details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Transaction Details" showBackButton />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading transaction details...</p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Transaction Details" showBackButton />
        <div className="flex-1 flex items-center justify-center">
          <p>Transaction not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-16">
      <Header title="Transaction Details" showBackButton rightElement={<div />} />
      
      <main className="flex-1 p-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Transaction Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Amount</dt>
                <dd className="text-lg font-medium">{formatCurrency(transaction.amount, 'XAF')}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Status</dt>
                <dd className="text-lg font-medium capitalize">{transaction.status}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Date</dt>
                <dd className="text-lg font-medium">
                  {new Date(transaction.created_at).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Time</dt>
                <dd className="text-lg font-medium">
                  {new Date(transaction.created_at).toLocaleTimeString()}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Recipient Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Name</dt>
                <dd className="text-lg font-medium">{transaction.recipient_name}</dd>
              </div>
              {transaction.recipient_contact && (
                <div>
                  <dt className="text-sm text-gray-500">Contact</dt>
                  <dd className="text-lg font-medium">{transaction.recipient_contact}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-gray-500">Country</dt>
                <dd className="text-lg font-medium">{transaction.country}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4">
              {transaction.payment_method && (
                <div>
                  <dt className="text-sm text-gray-500">Payment Method</dt>
                  <dd className="text-lg font-medium capitalize">
                    {transaction.payment_method.replace('_', ' ')}
                  </dd>
                </div>
              )}
              {transaction.provider && (
                <div>
                  <dt className="text-sm text-gray-500">Provider</dt>
                  <dd className="text-lg font-medium">{transaction.provider}</dd>
                </div>
              )}
              {transaction.fee && (
                <div>
                  <dt className="text-sm text-gray-500">Fee</dt>
                  <dd className="text-lg font-medium">{formatCurrency(transaction.fee, 'XAF')}</dd>
                </div>
              )}
              {transaction.total_amount && (
                <div>
                  <dt className="text-sm text-gray-500">Total Amount</dt>
                  <dd className="text-lg font-medium">{formatCurrency(transaction.total_amount, 'XAF')}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-6">
          <Button onClick={() => navigate('/history')}>
            Back to Transactions
          </Button>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default TransactionDetails;
