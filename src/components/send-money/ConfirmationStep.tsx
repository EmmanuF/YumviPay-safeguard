
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  ArrowRight, 
  Loader2, 
  RepeatIcon, 
  CreditCard, 
  Phone, 
  User, 
  Edit2, 
  ChevronDown, 
  Building, 
  Smartphone
} from 'lucide-react';
import { useCountries } from '@/hooks/useCountries';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import PaymentStepNavigation from './payment/PaymentStepNavigation';
import { Badge } from '@/components/ui/badge';
import RecurringPaymentOption from './payment/RecurringPaymentOption';

interface ConfirmationStepProps {
  transactionData: any;
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
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('monthly');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const selectedCountry = getCountryByCode(transactionData.targetCountry || 'CM');
  
  const getPaymentMethodIcon = (methodId: string) => {
    switch (methodId) {
      case 'mobile_money':
        return <Smartphone className="h-5 w-5 text-primary" />;
      case 'bank_transfer':
        return <Building className="h-5 w-5 text-primary" />;
      case 'credit_card':
        return <CreditCard className="h-5 w-5 text-primary" />;
      default:
        return <Phone className="h-5 w-5 text-primary" />;
    }
  };
  
  // Apply recurring settings to transaction data
  const handleConfirm = () => {
    if (isRecurring) {
      // Update transaction data with recurring settings
      transactionData.isRecurring = true;
      transactionData.recurringFrequency = recurringFrequency;
      
      // Store in localStorage
      localStorage.setItem('pendingTransaction', JSON.stringify(transactionData));
    }
    
    onConfirm();
  };
  
  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Animation variants
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

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-0">
            <CardTitle className="text-xl">Confirm Transfer</CardTitle>
            <CardDescription>
              Review your transfer details before confirming
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-4">
            {/* Transfer amount */}
            <div className="px-4 py-5 bg-primary/5 rounded-xl">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">You're sending</p>
                <h2 className="text-3xl font-bold text-primary mt-1">
                  {formatCurrency(transactionData.amount, transactionData.sourceCurrency)}
                </h2>
                <div className="flex items-center justify-center mt-2 text-muted-foreground">
                  <ArrowRight className="mx-2 h-4 w-4" />
                  <p>
                    {formatCurrency(transactionData.convertedAmount, transactionData.targetCurrency)}
                  </p>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    No fees
                  </span>
                </div>
              </div>
            </div>
            
            {/* Recipient */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-medium">Recipient</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-primary"
                  onClick={() => onBack()}
                >
                  <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
                </Button>
              </div>
              <div className="flex items-center p-3 bg-muted/30 rounded-lg">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{transactionData.recipientName || 'Not specified'}</p>
                  <p className="text-sm text-muted-foreground">{transactionData.recipient || 'No contact info'}</p>
                </div>
              </div>
            </div>
            
            {/* Payment method */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-medium">Payment Method</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-primary"
                  onClick={() => onBack()}
                >
                  <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
                </Button>
              </div>
              <div className="flex items-center p-3 bg-muted/30 rounded-lg">
                {transactionData.paymentMethod && (
                  <>
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      {getPaymentMethodIcon(transactionData.paymentMethod)}
                    </div>
                    <div>
                      <p className="font-medium">
                        {transactionData.paymentMethod.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transactionData.selectedProvider?.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'No provider selected'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Transaction details - collapsible */}
            <Collapsible
              open={isDetailsOpen}
              onOpenChange={setIsDetailsOpen}
              className="border border-border rounded-lg overflow-hidden"
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full flex justify-between p-3 h-auto">
                  <span className="font-medium">Transaction Details</span>
                  <ChevronDown className={`h-5 w-5 transition-transform ${isDetailsOpen ? 'transform rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-3 pt-0 space-y-3">
                <Separator />
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <p className="text-muted-foreground">Exchange Rate:</p>
                  <p className="text-right">
                    1 {transactionData.sourceCurrency} = {transactionData.exchangeRate.toFixed(2)} {transactionData.targetCurrency}
                  </p>
                  <p className="text-muted-foreground">Fee:</p>
                  <p className="text-right text-green-600">Free</p>
                  <p className="text-muted-foreground">Delivery Time:</p>
                  <p className="text-right">Instant - 10 minutes</p>
                  <p className="text-muted-foreground">Reference:</p>
                  <p className="text-right">{`YM-${Date.now().toString().substring(7)}`}</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            {/* Recurring payment option */}
            <RecurringPaymentOption
              isRecurring={isRecurring}
              frequency={recurringFrequency}
              onToggleRecurring={setIsRecurring}
              onChangeFrequency={setRecurringFrequency}
            />
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Navigation */}
      <motion.div variants={itemVariants} className="mt-4">
        <PaymentStepNavigation 
          onNext={handleConfirm}
          onBack={onBack}
          isNextDisabled={false}
          isSubmitting={isSubmitting}
          nextLabel={isSubmitting ? "Processing..." : "Confirm & Pay"}
        />
      </motion.div>
    </motion.div>
  );
};

export default ConfirmationStep;
