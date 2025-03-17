
import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Country } from '@/hooks/useCountries';
import PaymentMethodCard from '@/components/payment-method/PaymentMethodCard';
import { getProviderOptions, getIconComponent, getRecommendedPaymentMethods } from './PaymentProviderData';
import { Loader2, AlertTriangle } from 'lucide-react';

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

  // If we don't have a country code but we're in loading state
  if (!selectedCountryData && !selectedCountry) {
    return (
      <motion.div variants={itemVariants} className="mb-4">
        <h3 className="text-sm font-medium mb-3">Select Destination Country First</h3>
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 text-sm">
            Please select a destination country to see available payment methods.
          </p>
        </div>
      </motion.div>
    );
  }

  // Loading state
  if (!selectedCountryData && selectedCountry) {
    return (
      <motion.div variants={itemVariants} className="mb-4">
        <h3 className="text-sm font-medium mb-3">Select Payment Method</h3>
        <div className="p-6 flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-lg">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
          <p className="text-gray-600 text-sm">Loading payment methods...</p>
        </div>
      </motion.div>
    );
  }

  // If we don't have a valid country or no payment methods, show a message with a recommendation
  if (!selectedCountryData || !selectedCountryData.paymentMethods || selectedCountryData.paymentMethods.length === 0) {
    return (
      <motion.div variants={itemVariants} className="mb-4">
        <h3 className="text-sm font-medium mb-3">Select Payment Method</h3>
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
      <h3 className="text-sm font-medium mb-3">Select Payment Method</h3>
      <div className="space-y-3">
        {selectedCountryData.paymentMethods.map((method) => {
          // Get providers for this payment method and country
          const providers = getProviderOptions(method.id, selectedCountry);
          console.log(`Providers for ${method.id}:`, providers);
          
          // Check if this is a recommended method for this country
          const recommendedMethods = getRecommendedPaymentMethods(selectedCountry);
          const isRecommended = recommendedMethods.includes(method.id);
          
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
              isRecommended={isRecommended}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

export default PaymentMethodList;
