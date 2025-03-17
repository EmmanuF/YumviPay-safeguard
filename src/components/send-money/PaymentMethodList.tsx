
import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Country } from '@/hooks/useCountries';
import PaymentMethodCard from '@/components/payment-method/PaymentMethodCard';
import { getProviderOptions, getIconComponent, getRecommendedPaymentMethods } from './PaymentProviderData';
import { Loader2, AlertTriangle } from 'lucide-react';

interface PaymentMethodListProps {
  paymentMethods: Array<any>;
  selectedMethod: string | null;
  selectedProvider: string | undefined;
  onSelect: (method: string) => void;
  onSelectProvider: (provider: string) => void;
  countryCode: string;
}

const PaymentMethodList: React.FC<PaymentMethodListProps> = ({
  paymentMethods,
  selectedMethod,
  selectedProvider,
  onSelect,
  onSelectProvider,
  countryCode,
}) => {
  const { toast } = useToast();
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  const handlePaymentMethodSelect = (method: string) => {
    onSelect(method);
    
    // Find the payment method name to display in the toast
    const paymentMethod = paymentMethods.find(pm => pm.id === method);
    
    toast({
      title: "Payment method selected",
      description: `You've selected ${paymentMethod?.name || method}`,
      duration: 2000,
    });
  };

  // If we don't have payment methods, show a message
  if (!paymentMethods || paymentMethods.length === 0) {
    return (
      <motion.div variants={itemVariants} className="mb-4">
        <h3 className="text-lg font-medium mb-3 text-center">Choose Provider</h3>
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-amber-800 text-sm">
              No payment methods available for this country.
            </p>
            <p className="text-amber-700 text-sm mt-1">
              Try selecting Cameroon (CM) as your destination country for our MVP services.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemVariants} className="mb-4">
      <h3 className="text-lg font-medium mb-3 text-center">Choose Provider</h3>
      <div className="space-y-4">
        {paymentMethods.map((method) => {
          // Get providers for this payment method and country
          const providers = getProviderOptions(method.id, countryCode);
          
          // Check if this is a recommended method for this country
          const recommendedMethods = getRecommendedPaymentMethods(countryCode);
          const isRecommended = recommendedMethods.includes(method.id);
          
          return (
            <PaymentMethodCard
              key={method.id}
              name={method.name}
              description={method.description}
              icon={getIconComponent(method.icon)}
              isSelected={selectedMethod === method.id}
              onClick={() => handlePaymentMethodSelect(method.id)}
              options={providers}
              countryCode={countryCode}
              selectedOption={selectedMethod === method.id ? selectedProvider : ''}
              onOptionSelect={onSelectProvider}
              isRecommended={isRecommended}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

export default PaymentMethodList;
