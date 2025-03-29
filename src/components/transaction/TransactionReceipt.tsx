
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Transaction } from '@/types/transaction';
import { useLocale } from '@/contexts/LocaleContext';
import { formatTransactionAmount } from '@/utils/transactionAmountUtils';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, AlertCircle } from 'lucide-react';

interface TransactionReceiptProps {
  transaction: Transaction;
  onShare?: () => void;
  onDownload?: () => void;
}

const TransactionReceipt: React.FC<TransactionReceiptProps> = ({
  transaction,
  onShare,
  onDownload
}) => {
  const { t, locale } = useLocale();
  
  // Handle display for various transaction statuses
  const getStatusDisplay = () => {
    switch(transaction.status) {
      case 'completed':
        return {
          label: t('transaction.success'),
          icon: <Check className="h-4 w-4" />,
          color: 'bg-green-100 text-green-800'
        };
      case 'processing':
      case 'pending':
        return {
          label: t('transaction.processing'),
          icon: <Clock className="h-4 w-4" />,
          color: 'bg-yellow-100 text-yellow-800'
        };
      case 'failed':
        return {
          label: t('transaction.failed'),
          icon: <AlertCircle className="h-4 w-4" />,
          color: 'bg-red-100 text-red-800'
        };
      default:
        return {
          label: transaction.status,
          icon: <Clock className="h-4 w-4" />,
          color: 'bg-gray-100 text-gray-800'
        };
    }
  };
  
  const statusDisplay = getStatusDisplay();
  
  // Format the transaction date with locale support
  const formattedDate = transaction.createdAt 
    ? format(new Date(transaction.createdAt), 'PPP', {
        locale: locale === 'fr' ? fr : undefined
      })
    : 'N/A';
    
  const formattedTime = transaction.createdAt 
    ? format(new Date(transaction.createdAt), 'p', {
        locale: locale === 'fr' ? fr : undefined
      })
    : 'N/A';
  
  // Format the transaction amount
  const amount = typeof transaction.amount === 'string' 
    ? parseFloat(transaction.amount) 
    : transaction.amount || 0;
    
  const formattedAmount = formatTransactionAmount(amount, {
    currency: 'USD',
    locale: locale === 'fr' ? 'fr-FR' : 'en-US'
  });
  
  // If converted amount is available, format it
  const convertedAmount = transaction.convertedAmount || (amount * 610);
  const formattedConvertedAmount = formatTransactionAmount(convertedAmount, {
    currency: 'XAF',
    locale: locale === 'fr' ? 'fr-FR' : 'en-US'
  });
  
  return (
    <Card className="mb-4 shadow-sm border-0 glass-effect">
      <CardContent className="pt-6">
        <div className="text-center mb-4">
          <Badge className={`${statusDisplay.color} flex items-center gap-1 mx-auto`}>
            {statusDisplay.icon}
            {statusDisplay.label}
          </Badge>
          
          <h2 className="text-3xl font-bold mt-4 mb-1">
            {formattedAmount}
          </h2>
          
          <p className="text-sm text-muted-foreground">
            {formattedConvertedAmount}
          </p>
        </div>
        
        <div className="space-y-3 mt-6">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-muted-foreground">{t('transaction.recipient')}</span>
            <span className="text-sm font-medium">{transaction.recipientName}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-muted-foreground">{t('momo.number')}</span>
            <span className="text-sm font-medium">{transaction.recipientContact}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-muted-foreground">{t('transaction.payment_method')}</span>
            <span className="text-sm font-medium">{transaction.provider || transaction.paymentMethod}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-muted-foreground">{t('transaction.date')}</span>
            <span className="text-sm font-medium">{formattedDate}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-muted-foreground">{t('transaction.time')}</span>
            <span className="text-sm font-medium">{formattedTime}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-muted-foreground">{t('transaction.referenceId')}</span>
            <span className="text-sm font-medium">{transaction.id}</span>
          </div>
          
          {transaction.estimatedDelivery && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-muted-foreground">
                {t('transaction.estimatedDelivery', {delivery: transaction.estimatedDelivery})}
              </span>
              <span className="text-sm font-medium">{transaction.estimatedDelivery}</span>
            </div>
          )}
          
          {transaction.exchangeRate && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-muted-foreground">{t('transaction.exchangeRate')}</span>
              <span className="text-sm font-medium">1 USD = {transaction.exchangeRate} XAF</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionReceipt;
