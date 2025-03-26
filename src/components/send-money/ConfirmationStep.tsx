
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, RepeatIcon, ArrowRight, CheckCircle } from 'lucide-react';
import { useCountries } from '@/hooks/useCountries';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatUtils';

export interface ConfirmationStepProps {
  transactionData: {
    amount: number;
    sourceCurrency: string;
    targetCurrency: string;
    convertedAmount: number;
    recipient: string | null;
    recipientName?: string;
    paymentMethod: string | null;
    selectedProvider?: string;
    isRecurring?: boolean;
    recurringFrequency?: string;
    termsAccepted?: boolean;
  };
  onConfirm: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  transactionData,
  onConfirm,
  onBack,
  isSubmitting = false
}) => {
  const { getCountryByCode } = useCountries();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  const getRecurringFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return 'Weekly';
      case 'biweekly': return 'Every 2 Weeks';
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Every 3 Months';
      default: return 'Regularly';
    }
  };

  // Format payment method name for display
  const formatMethodName = (method: string | null) => {
    if (!method) return 'Not specified';
    return method
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-indigo-800">Review Your Transfer</h2>
          {transactionData.isRecurring && (
            <Badge className="bg-secondary-100 text-secondary-800 hover:bg-secondary-200 flex items-center">
              <RepeatIcon size={14} className="mr-1" />
              {getRecurringFrequencyText(transactionData.recurringFrequency || 'monthly')}
            </Badge>
          )}
        </div>
        
        <Card className="shadow-lg border border-secondary-100/30">
          <CardContent className="p-6 space-y-6">
            {/* Amount section */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-indigo-700 mb-3">Transfer Amount</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">You send</p>
                  <p className="text-xl font-bold">{formatCurrency(transactionData.amount, transactionData.sourceCurrency)}</p>
                </div>
                <div className="text-center px-3">
                  <ArrowRight className="h-5 w-5 text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Recipient gets</p>
                  <p className="text-xl font-bold">{formatCurrency(transactionData.convertedAmount, transactionData.targetCurrency)}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Exchange rate</span>
                  <span className="font-medium">
                    1 {transactionData.sourceCurrency} = {(transactionData.convertedAmount / transactionData.amount).toFixed(2)} {transactionData.targetCurrency}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">Fee</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
              </div>
            </div>
            
            {/* Recipient details */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-indigo-700 mb-3">Recipient</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium">{transactionData.recipientName || 'Not specified'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Contact</span>
                  <span className="font-medium">{transactionData.recipient || 'Not specified'}</span>
                </div>
              </div>
            </div>
            
            {/* Payment method details */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-indigo-700 mb-3">Payment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Method</span>
                  <span className="font-medium">{formatMethodName(transactionData.paymentMethod)}</span>
                </div>
                {transactionData.selectedProvider && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Provider</span>
                    <span className="font-medium">{transactionData.selectedProvider}</span>
                  </div>
                )}
                {transactionData.isRecurring && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Recurring</span>
                    <span className="font-medium text-secondary-600">{getRecurringFrequencyText(transactionData.recurringFrequency || 'monthly')}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Recurring payment info */}
            {transactionData.isRecurring && (
              <div className="bg-secondary-50 rounded-xl p-4 border border-secondary-100">
                <div className="flex items-start">
                  <RepeatIcon className="text-secondary-600 mt-0.5 mr-3 h-5 w-5" />
                  <div>
                    <h4 className="font-medium text-secondary-800">Recurring Payment</h4>
                    <p className="text-sm text-secondary-700 mt-1">
                      This payment will be sent {transactionData.recurringFrequency === 'weekly' ? 'every week' : 
                      transactionData.recurringFrequency === 'biweekly' ? 'every 2 weeks' : 
                      transactionData.recurringFrequency === 'monthly' ? 'every month' : 
                      'every 3 months'} until cancelled.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Success message */}
            <div className="bg-primary-50 rounded-xl p-4 border border-primary-100 flex items-start">
              <CheckCircle className="text-primary-600 mt-0.5 mr-3 h-5 w-5" />
              <div>
                <h4 className="font-medium text-primary-800">Ready to Complete</h4>
                <p className="text-sm text-primary-700 mt-1">
                  All details have been verified. Click the button below to confirm and complete your payment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants} className="pt-4 flex space-x-3">
        <Button 
          variant="outline"
          onClick={onBack} 
          className="w-1/2 border-secondary-300" 
          size="lg"
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button 
          onClick={onConfirm} 
          className="w-1/2 bg-primary hover:bg-primary-600 group" 
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Confirm & Pay
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmationStep;
