
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, RepeatIcon, ArrowRight, CheckCircle, Shield, AlertTriangle, Clock } from 'lucide-react';
import { useCountries } from '@/hooks/useCountries';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatUtils';
import PaymentStepNavigation from './payment/PaymentStepNavigation';

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
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 24 
      }
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

  // Enhanced handlers with detailed logging for debugging
  const handleNextClick = () => {
    console.log("Confirm button clicked in ConfirmationStep, calling onConfirm()");
    onConfirm();
  };

  const handleBackClick = () => {
    console.log("Back button clicked in ConfirmationStep, calling onBack()");
    onBack();
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-20" // Added padding to ensure buttons are visible
    >
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <motion.h2 
            className="text-xl font-bold text-gradient-primary"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Review Your Transfer
          </motion.h2>
          <AnimatePresence>
            {transactionData.isRecurring && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <Badge className="bg-secondary-500 text-white hover:bg-secondary-600 flex items-center py-1.5">
                  <RepeatIcon size={14} className="mr-1" />
                  {getRecurringFrequencyText(transactionData.recurringFrequency || 'monthly')}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <Card className="glass-effect border-primary-100/30 shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30"></div>
          
          <CardContent className="p-6 space-y-6">
            {/* Amount section */}
            <motion.div 
              className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100/80 card-hover"
              variants={itemVariants}
              whileHover={{ y: -2, boxShadow: "0 12px 24px -8px rgba(0, 128, 0, 0.15)" }}
            >
              <h3 className="text-lg font-semibold text-primary-700 mb-3">Transfer Amount</h3>
              <div className="flex justify-between items-center">
                <div className="bg-primary-50/60 p-3 rounded-lg">
                  <p className="text-sm text-primary-600">You send</p>
                  <p className="text-xl font-bold text-primary-800">{formatCurrency(transactionData.amount, transactionData.sourceCurrency)}</p>
                </div>
                <div className="text-center px-3 relative">
                  <div className="bg-gray-100 w-full h-0.5 absolute top-1/2 left-0 right-0 transform -translate-y-1/2"></div>
                  <div className="relative">
                    <motion.div
                      animate={{
                        x: [0, 10, 0],
                        transition: {
                          repeat: Infinity,
                          repeatType: "reverse",
                          duration: 1.5
                        }
                      }}
                    >
                      <ArrowRight className="h-6 w-6 text-primary bg-white rounded-full p-0.5 shadow-sm" />
                    </motion.div>
                  </div>
                </div>
                <div className="bg-secondary-50/60 p-3 rounded-lg text-right">
                  <p className="text-sm text-secondary-600">Recipient gets</p>
                  <p className="text-xl font-bold text-secondary-800">{formatCurrency(transactionData.convertedAmount, transactionData.targetCurrency)}</p>
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
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center mt-4"
                >
                  <Badge 
                    variant="outline" 
                    className="bg-green-50 text-green-700 border-green-200 px-3 py-1 flex items-center"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" /> Best Rate Available
                  </Badge>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Recipient details */}
            <motion.div 
              className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100/80 card-hover"
              variants={itemVariants}
              whileHover={{ y: -2, boxShadow: "0 12px 24px -8px rgba(138, 43, 226, 0.15)" }}
            >
              <h3 className="text-lg font-semibold text-primary-700 mb-3">Recipient</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium text-gray-800">{transactionData.recipientName || 'Not specified'}</span>
                </div>
                <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg">
                  <span className="text-gray-500">Contact</span>
                  <span className="font-medium text-gray-800">{transactionData.recipient || 'Not specified'}</span>
                </div>
              </div>
            </motion.div>
            
            {/* Payment method details */}
            <motion.div 
              className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100/80 card-hover"
              variants={itemVariants}
              whileHover={{ y: -2, boxShadow: "0 12px 24px -8px rgba(138, 43, 226, 0.15)" }}
            >
              <h3 className="text-lg font-semibold text-primary-700 mb-3">Payment Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg">
                  <span className="text-gray-500">Method</span>
                  <span className="font-medium text-gray-800">{formatMethodName(transactionData.paymentMethod)}</span>
                </div>
                {transactionData.selectedProvider && (
                  <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg">
                    <span className="text-gray-500">Provider</span>
                    <span className="font-medium text-gray-800">{transactionData.selectedProvider}</span>
                  </div>
                )}
                {transactionData.isRecurring && (
                  <div className="flex justify-between items-center bg-secondary-50/60 p-3 rounded-lg">
                    <span className="text-secondary-600">Recurring</span>
                    <span className="font-medium text-secondary-800">{getRecurringFrequencyText(transactionData.recurringFrequency || 'monthly')}</span>
                  </div>
                )}
              </div>
            </motion.div>
            
            {/* Recurring payment info */}
            <AnimatePresence>
              {transactionData.isRecurring && (
                <motion.div 
                  className="bg-secondary-50/70 backdrop-blur-sm rounded-xl p-5 border border-secondary-100/60 card-hover"
                  variants={itemVariants}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
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
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Estimated Delivery */}
            <motion.div 
              className="bg-blue-50/70 backdrop-blur-sm rounded-xl p-5 border border-blue-100/60 card-hover flex items-start"
              variants={itemVariants}
            >
              <Clock className="text-blue-600 mt-0.5 mr-3 h-5 w-5" />
              <div>
                <h4 className="font-medium text-blue-800">Estimated Delivery</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Your recipient should receive this payment within minutes after confirmation.
                </p>
              </div>
            </motion.div>
            
            {/* Success message */}
            <motion.div 
              className="bg-primary-50/70 backdrop-blur-sm rounded-xl p-5 border border-primary-100/60 flex items-start card-hover"
              variants={itemVariants}
            >
              <CheckCircle className="text-primary-600 mt-0.5 mr-3 h-5 w-5" />
              <div>
                <h4 className="font-medium text-primary-800">Ready to Complete</h4>
                <p className="text-sm text-primary-700 mt-1">
                  All details have been verified. Click the button below to confirm and complete your payment.
                </p>
              </div>
            </motion.div>
            
            {/* Security note */}
            <motion.div 
              className="bg-muted/30 backdrop-blur-sm rounded-xl p-3 border border-muted/20 flex items-center justify-center card-hover"
              variants={itemVariants}
            >
              <Shield className="text-gray-500 mr-2 h-4 w-4" />
              <p className="text-xs text-gray-500">Secured by Yumvi-Pay with end-to-end encryption</p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Replace the custom buttons with the consistent PaymentStepNavigation component */}
      <PaymentStepNavigation
        onNext={handleNextClick}
        onBack={handleBackClick}
        isNextDisabled={false}
        isSubmitting={isSubmitting}
      />
    </motion.div>
  );
};

export default ConfirmationStep;
