
import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Country } from '@/hooks/useCountries';
import PaymentMethodCard from '@/components/payment-method/PaymentMethodCard';
import { getProviderOptions, getIconComponent } from './PaymentProviderData';

interface PaymentMethodListProps {
  selectedCountry: string;
  selectedCountryData: Country | undefined;
  selectedPaymentMethod: string | null;
  selectedProvider: string | undefined;
  onSelectPaymentMethod: (method: string) => void;
  onSelectProvider: (providerId: string) => void;
  providerOptions: {
    [key: string]: {
      [key: string]: Array<{ id: string; name: string }>;
      default: Array<{ id: string; name: string }>;
    };
  };
}

const PaymentMethodList: React.FC<PaymentMethodListProps> = ({
  selectedCountry,
  selectedCountryData,
  selectedPaymentMethod,
  selectedProvider,
  onSelectPaymentMethod,
  onSelectProvider,
  providerOptions,
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

  console.log('PaymentMethodList - selectedCountry:', selectedCountry);
  console.log('PaymentMethodList - selectedCountryData:', selectedCountryData);
  console.log('PaymentMethodList - paymentMethods:', selectedCountryData?.paymentMethods || []);

  const handlePaymentMethodSelect = (method: string) => {
    onSelectPaymentMethod(method);
    
    // Find the payment method name to display in the toast
    const paymentMethod = selectedCountryData?.paymentMethods.find(pm => pm.id === method);
    
    toast({
      title: "Payment method selected",
      description: `You've selected ${paymentMethod?.name || method}`,
      duration: 2000,
    });
  };

  return (
    <motion.div variants={itemVariants} className="mb-4">
      <h3 className="text-sm font-medium mb-3">Select Payment Method</h3>
      <div className="space-y-3">
        {selectedCountryData?.paymentMethods && selectedCountryData.paymentMethods.length > 0 ? (
          selectedCountryData.paymentMethods.map((method) => {
            // Get providers for this payment method and country
            const providers = getProviderOptions(method.id, selectedCountry);
            console.log(`Providers for ${method.id}:`, providers);
            
            return (
              <PaymentMethodCard
                key={method.id}
                name={method.name}
                description={method.description}
                icon={getIconComponent(method.icon)}
                isSelected={selectedPaymentMethod === method.id}
                onClick={() => handlePaymentMethodSelect(method.id)}
                options={providers}
                countryCode={selectedCountry}
                selectedOption={selectedPaymentMethod === method.id ? selectedProvider : ''}
                onOptionSelect={onSelectProvider}
              />
            );
          })
        ) : (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">
              No payment methods available for this country. Please select a different country.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PaymentMethodList;
