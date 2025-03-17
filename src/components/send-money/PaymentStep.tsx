
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCountries } from '@/hooks/useCountries';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import PaymentMethodList from './PaymentMethodList';
import TransactionSummary from './TransactionSummary';
import { providerOptions, getProviderOptions, getRecommendedPaymentMethods, getRecommendedProviders } from './PaymentProviderData';
import { Loader2, AlertCircle, Clock, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export interface PaymentStepProps {
  transactionData: {
    amount: number;
    sourceCurrency: string;
    targetCurrency: string;
    convertedAmount: number;
    recipient: string | null;
    recipientName?: string;
    paymentMethod: string | null;
    selectedProvider?: string;
    targetCountry?: string;
    savePaymentPreference?: boolean;
  };
  updateTransactionData: (data: Partial<any>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  transactionData,
  updateTransactionData,
  onNext,
  onBack
}) => {
  const { toast } = useToast();
  const { countries, getCountryByCode, isLoading } = useCountries();
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [savePreference, setSavePreference] = useState(transactionData.savePaymentPreference || false);
  const [showPreferredMethods, setShowPreferredMethods] = useState(true);
  
  // The country code to use - either from targetCountry or found by currency
  // If nothing is found, default to Cameroon (CM) as the MVP
  const countryCode = transactionData.targetCountry || 
                     (countries.find(country => country.currency === transactionData.targetCurrency)?.code || 'CM');
  
  // Find the selected country data
  const selectedCountry = getCountryByCode(countryCode);
  
  console.log('PaymentStep - transactionData:', transactionData);
  console.log('PaymentStep - countryCode:', countryCode);
  console.log('PaymentStep - selectedCountry:', selectedCountry);
  
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

  // Load preferred payment methods
  const preferredMethods = [
    { methodId: 'mobile_money', providerId: 'mtn_momo' },
    { methodId: 'bank_transfer', providerId: 'afriland' }
  ];

  // Ensure we have a targetCountry set
  useEffect(() => {
    if (!transactionData.targetCountry && countryCode && !isInitialized) {
      updateTransactionData({ targetCountry: countryCode });
      setIsInitialized(true);
      
      // If countryCode is CM, show a toast highlighting it's the MVP
      if (countryCode === 'CM' && !isLoading) {
        toast({
          title: "Cameroon Selected",
          description: "Cameroon is our primary supported country for this MVP.",
          variant: "default"
        });
      }
    }
  }, [countryCode, transactionData.targetCountry, updateTransactionData, isInitialized, isLoading, toast]);

  // Reset provider selection when payment method changes
  useEffect(() => {
    if (transactionData.paymentMethod && countryCode) {
      // Get available providers for this payment method and country
      const providers = getProviderOptions(
        transactionData.paymentMethod, 
        countryCode
      );
      
      console.log('Available providers:', providers);
      
      // If there are providers and we don't have one selected yet, select the first one
      if (providers.length > 0 && !transactionData.selectedProvider) {
        // Try to select a recommended provider first
        const recommended = getRecommendedProviders(transactionData.paymentMethod)[0];
        updateTransactionData({ 
          selectedProvider: recommended?.id || providers[0].id 
        });
        console.log('Auto-selected provider:', recommended?.id || providers[0].id);
      }
    }
  }, [transactionData.paymentMethod, countryCode, updateTransactionData, transactionData.selectedProvider]);

  const handleProceedToPayment = () => {
    // Save payment preference if selected
    if (savePreference) {
      updateTransactionData({ savePaymentPreference: true });
      
      // This would normally save to a database
      toast("Payment preference saved", {
        description: "Your preferred payment method has been saved for future transactions",
      });
    }
    
    toast({
      title: "Processing payment",
      description: "Redirecting to payment gateway",
      duration: 3000,
    });
    onNext();
  };

  const handleToggleSavePreference = (checked: boolean) => {
    setSavePreference(checked);
    updateTransactionData({ savePaymentPreference: checked });
  };

  const handleTogglePreferredMethods = (checked: boolean) => {
    setShowPreferredMethods(checked);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-gray-600">Loading payment options...</p>
      </div>
    );
  }

  // Show warning if not using Cameroon (MVP)
  const showMvpWarning = selectedCountry && selectedCountry.code !== 'CM';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {showMvpWarning && (
        <motion.div variants={itemVariants} className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> Cameroon is our primary supported country for the MVP.
            </p>
            <p className="text-blue-700 text-xs mt-1">
              Other countries may have limited payment options or features during this phase.
            </p>
          </div>
        </motion.div>
      )}

      {/* Preferred Payment Methods Toggle */}
      {preferredMethods.length > 0 && (
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <Label htmlFor="show-preferred" className="text-sm font-medium">
              Show preferred payment methods
            </Label>
          </div>
          <Switch 
            id="show-preferred" 
            checked={showPreferredMethods} 
            onCheckedChange={handleTogglePreferredMethods}
          />
        </motion.div>
      )}

      {/* Preferred Payment Methods */}
      {showPreferredMethods && preferredMethods.length > 0 && (
        <motion.div variants={itemVariants} className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-primary-500" />
            <h4 className="text-sm font-medium">Recent & Preferred Methods</h4>
          </div>
          <div className="space-y-2 bg-muted/30 p-3 rounded-lg">
            {preferredMethods.map((method, index) => {
              const methodDetails = selectedCountry?.paymentMethods.find(m => m.id === method.methodId);
              if (!methodDetails) return null;
              
              const providers = getProviderOptions(method.methodId, countryCode);
              const provider = providers.find(p => p.id === method.providerId);
              if (!provider) return null;
              
              return (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-background rounded-md border border-border cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    updateTransactionData({
                      paymentMethod: method.methodId,
                      selectedProvider: method.providerId
                    });
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                      {method.methodId === 'mobile_money' ? (
                        <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{methodDetails.name}</p>
                      <p className="text-xs text-muted-foreground">{provider.name}</p>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${transactionData.paymentMethod === method.methodId && transactionData.selectedProvider === method.providerId ? 'bg-primary' : 'bg-muted'}`} />
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      <PaymentMethodList 
        selectedCountry={countryCode}
        selectedCountryData={selectedCountry}
        selectedPaymentMethod={transactionData.paymentMethod}
        selectedProvider={transactionData.selectedProvider}
        onSelectPaymentMethod={(method) => updateTransactionData({ 
          paymentMethod: method,
          selectedProvider: null  // Reset provider when method changes
        })}
        onSelectProvider={(providerId) => updateTransactionData({ 
          selectedProvider: providerId 
        })}
        providerOptions={providerOptions}
      />

      <TransactionSummary 
        amount={String(transactionData.amount)}
        selectedCountryData={selectedCountry}
        selectedCountry={countryCode}
        recipientName={transactionData.recipientName || ''}
        recipient={transactionData.recipient || ''}
        selectedPaymentMethod={transactionData.paymentMethod}
        selectedProvider={transactionData.selectedProvider}
      />

      {/* Save payment preference option */}
      {user && (
        <motion.div variants={itemVariants} className="flex items-center justify-between mt-4 p-3 bg-muted/50 rounded-lg">
          <div>
            <Label htmlFor="save-preference" className="text-sm font-medium">
              Save as preferred payment method
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              This will be pre-selected for future transactions
            </p>
          </div>
          <Switch 
            id="save-preference" 
            checked={savePreference} 
            onCheckedChange={handleToggleSavePreference}
          />
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="pt-4 flex space-x-3">
        <Button 
          variant="outline"
          onClick={onBack} 
          className="w-1/2" 
          size="lg"
        >
          Back
        </Button>
        <Button 
          onClick={handleProceedToPayment} 
          className="w-1/2" 
          size="lg"
          disabled={!transactionData.paymentMethod || !transactionData.selectedProvider || !selectedCountry || !selectedCountry.paymentMethods || selectedCountry.paymentMethods.length === 0}
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PaymentStep;
