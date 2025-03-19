
import React from 'react';
import { ArrowRight, CheckCircle, AlertCircle, Clock, Download, Share2 } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCountries } from '@/hooks/useCountries';
import { formatDate, formatCurrency } from '@/utils/formatUtils';

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
  const { getCountryByCode } = useCountries();
  const countryCode = transaction.recipientCountryCode || 'CM';
  const country = getCountryByCode(countryCode);
  
  // Helper function to convert amount to string
  const formatAmount = (amount: string | number | undefined): string => {
    if (amount === undefined) return '0';
    return typeof amount === 'number' ? amount.toString() : amount;
  };
  
  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Clock className="w-6 h-6 text-amber-500" />;
    }
  };
  
  const getStatusText = () => {
    switch (transaction.status) {
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'processing':
        return 'Processing';
      default:
        return 'Pending';
    }
  };
  
  const getStatusColor = () => {
    switch (transaction.status) {
      case 'completed':
        return 'bg-green-50 text-green-700';
      case 'failed':
        return 'bg-red-50 text-red-700';
      case 'processing':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-amber-50 text-amber-700';
    }
  };

  // Function to format fee as currency or 'Free'
  const displayFee = () => {
    const fee = transaction.fee;
    if (!fee || parseFloat(fee.toString()) === 0) {
      return 'Free';
    }
    return formatCurrency(fee);
  };

  return (
    <Card className="border-none shadow-lg print:shadow-none">
      <CardContent className="p-0">
        {/* Header */}
        <div className={`p-6 ${getStatusColor()} print:bg-white print:border-b`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-lg font-bold">{getStatusText()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Transaction ID</p>
              <p className="text-sm font-mono">{transaction.id}</p>
            </div>
          </div>
        </div>
        
        {/* Amount */}
        <div className="p-6 bg-primary-50 print:bg-white print:border-b">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-primary-600 print:text-charcoal">Amount Sent</p>
              <p className="text-2xl font-bold text-primary-700 print:text-charcoal">
                ${formatAmount(transaction.amount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary-600 print:text-charcoal">Fee</p>
              <p className="text-lg font-semibold text-green-600">
                {displayFee()}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm font-medium text-primary-600 print:text-charcoal">Total</p>
            <p className="text-lg font-bold text-primary-700 print:text-charcoal">
              ${formatAmount(transaction.totalAmount || transaction.amount)}
            </p>
          </div>
        </div>
        
        {/* Details */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-charcoal/60 mb-2">RECIPIENT</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-charcoal/70">Name</span>
                  <span className="font-medium text-charcoal">{transaction.recipientName}</span>
                </div>
                {transaction.recipientContact && (
                  <div className="flex justify-between">
                    <span className="text-charcoal/70">Contact</span>
                    <span className="font-medium text-charcoal">{transaction.recipientContact}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-charcoal/70">Country</span>
                  <span className="font-medium text-charcoal">{transaction.recipientCountry || country?.name || transaction.country}</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium text-charcoal/60 mb-2">PAYMENT DETAILS</h3>
              <div className="space-y-2">
                {transaction.paymentMethod && (
                  <div className="flex justify-between">
                    <span className="text-charcoal/70">Method</span>
                    <span className="font-medium text-charcoal">{transaction.paymentMethod.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                  </div>
                )}
                {transaction.provider && (
                  <div className="flex justify-between">
                    <span className="text-charcoal/70">Provider</span>
                    <span className="font-medium text-charcoal">{transaction.provider}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-charcoal/70">Date</span>
                  <span className="font-medium text-charcoal">{formatDate(transaction.createdAt)}</span>
                </div>
                {transaction.estimatedDelivery && transaction.status !== 'completed' && (
                  <div className="flex justify-between">
                    <span className="text-charcoal/70">Estimated Delivery</span>
                    <span className="font-medium text-charcoal">{transaction.estimatedDelivery}</span>
                  </div>
                )}
                {transaction.completedAt && (
                  <div className="flex justify-between">
                    <span className="text-charcoal/70">Completed</span>
                    <span className="font-medium text-charcoal">{formatDate(transaction.completedAt)}</span>
                  </div>
                )}
                {transaction.failureReason && (
                  <div className="flex justify-between">
                    <span className="text-charcoal/70">Failure Reason</span>
                    <span className="font-medium text-red-600">{transaction.failureReason}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions - Only show if both functions are provided */}
        {(onDownload || onShare) && (
          <div className="p-6 bg-gray-50 flex justify-between gap-3 print:hidden">
            {onDownload && (
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={onDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
            {onShare && (
              <Button 
                className="flex-1"
                onClick={onShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionReceipt;
