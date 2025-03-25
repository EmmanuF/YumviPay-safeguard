import React from 'react';
import { ArrowRight, CheckCircle, AlertCircle, Clock, Download, Share2 } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCountries } from '@/hooks/useCountries';
import { formatDate } from '@/utils/formatUtils';
import { getTransactionAmount } from '@/utils/transactionDataStore';

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
  
  // Enhanced amount formatting with better fallbacks and consistency
  const formatAmount = (amount: string | number | undefined): string => {
    if (amount === undefined) {
      // Try to get amount from transaction data store for reliability
      const storeAmount = window.getTransactionAmount?.();
      if (storeAmount) return storeAmount.toString();
      return '0';
    }
    
    // Handle different amount formats consistently
    if (typeof amount === 'number') {
      // Ensure we don't show long decimal values
      return Number(amount).toFixed(2);
    }
    
    // Try parsing the string to format consistently
    const parsed = parseFloat(amount);
    if (!isNaN(parsed)) {
      return parsed.toFixed(2);
    }
    
    // Return original string if we can't format it
    return amount;
  };
  
  // Get the most reliable amount value
  const getReliableAmount = (): string => {
    // Try transaction data store first
    const storeAmount = window.getTransactionAmount?.();
    if (storeAmount) return storeAmount.toString();
    
    // Try transaction.sendAmount next (most accurate)
    if (transaction.sendAmount !== undefined) {
      return formatAmount(transaction.sendAmount);
    }
    
    // Fall back to transaction.amount
    return formatAmount(transaction.amount);
  };
  
  // Get status icon
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
  
  // Get status text
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
  
  // Get status color
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

  return (
    <Card className="border-none shadow-lg">
      <CardContent className="p-0">
        {/* Header */}
        <div className={`p-6 ${getStatusColor()}`}>
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
        <div className="p-6 bg-primary-50">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-primary-700">Amount Sent</p>
              <p className="text-2xl font-bold text-primary-900">
                ${getReliableAmount()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary-700">Fee</p>
              <p className="text-lg font-semibold text-green-600">
                Free
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm font-medium text-primary-700">Total</p>
            <p className="text-lg font-bold text-primary-900">
              ${getReliableAmount()}
            </p>
          </div>
        </div>
        
        {/* Details */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">RECIPIENT</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium">{transaction.recipientName}</span>
                </div>
                {transaction.recipientContact && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contact</span>
                    <span className="font-medium">{transaction.recipientContact}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Country</span>
                  <span className="font-medium">{transaction.recipientCountry || country?.name || transaction.country}</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">PAYMENT DETAILS</h3>
              <div className="space-y-2">
                {transaction.paymentMethod && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method</span>
                    <span className="font-medium">{transaction.paymentMethod.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                  </div>
                )}
                {transaction.provider && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Provider</span>
                    <span className="font-medium">{transaction.provider}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{formatDate(transaction.createdAt)}</span>
                </div>
                {transaction.estimatedDelivery && transaction.status !== 'completed' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Delivery</span>
                    <span className="font-medium">{transaction.estimatedDelivery}</span>
                  </div>
                )}
                {transaction.completedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-medium">{formatDate(transaction.completedAt)}</span>
                  </div>
                )}
                {transaction.failureReason && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Failure Reason</span>
                    <span className="font-medium text-red-600">{transaction.failureReason}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="p-6 bg-gray-50 flex justify-between gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button 
            className="flex-1"
            onClick={onShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionReceipt;
