
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAvailableMethods } from '@/data/cameroonPaymentProviders';
import { PaymentMethodCard } from '@/components/PaymentMethodCard';
import { getProviderOptions } from '@/utils/paymentUtils';
import PaymentLoadingState from './PaymentLoadingState';
import { Shield, AlertTriangle } from 'lucide-react';

interface CountryPaymentMethodsProps {
  countryCode: string;
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
  selectedProvider: string;
  onSelectProvider: (provider: string) => void;
}

const CountryPaymentMethods: React.FC<CountryPaymentMethodsProps> = ({
  countryCode,
  selectedMethod,
  onSelectMethod,
  selectedProvider,
  onSelectProvider
}) => {
  const [loading, setLoading] = useState(true);
  const [methods, setMethods] = useState<any[]>([]);
  
  useEffect(() => {
    // Simulate loading for better UX
    setLoading(true);
    
    // Small timeout to simulate network request
    const timer = setTimeout(() => {
      try {
        // Get available methods for the country
        const availableMethods = getAvailableMethods(countryCode);
        console.log(`Available methods for ${countryCode}:`, availableMethods);
        setMethods(availableMethods);
        
        // Auto-select first method if none is selected
        if (availableMethods.length > 0 && !selectedMethod) {
          const firstAvailableMethod = availableMethods.find(m => !m.comingSoon)?.id;
          if (firstAvailableMethod) {
            onSelectMethod(firstAvailableMethod);
            
            // Auto-select first provider
            const providers = getProviderOptions(firstAvailableMethod, countryCode);
            if (providers.length > 0) {
              onSelectProvider(providers[0].id);
            }
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading payment methods:', error);
        setLoading(false);
      }
    }, 400);
    
    return () => clearTimeout(timer);
  }, [countryCode, selectedMethod, onSelectMethod, onSelectProvider]);
  
  if (loading) {
    return <PaymentLoadingState />;
  }
  
  if (methods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">No Payment Methods Available</h3>
        <p className="text-gray-500">
          We're still expanding our payment options for this country.
          Please check back soon or select a different country.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 pb-8">
      {methods.map((method) => {
        // Get providers
        const providers = getProviderOptions(method.id, countryCode);
        
        return (
          <div key={method.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h3 className="font-medium text-sm">{method.name}</h3>
                {method.comingSoon && (
                  <span className="ml-2 py-0.5 px-2 bg-amber-100 text-amber-800 text-xs rounded-full">
                    Coming Soon
                  </span>
                )}
              </div>
              {!method.comingSoon && (
                <div className="flex items-center text-xs text-gray-500">
                  <Shield className="h-3 w-3 mr-1 text-green-500" />
                  {method.id === 'mobile_money' ? 'Instant Transfer' : '1-2 Business Days'}
                </div>
              )}
            </div>
            
            {method.comingSoon ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 opacity-60">
                <p className="text-center text-sm text-gray-500">
                  This payment method will be available soon
                </p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <PaymentMethodCard
                  id={method.id}
                  title={method.name}
                  description={method.description}
                  providerOptions={providers}
                  selectedProvider={selectedProvider}
                  onSelectProvider={onSelectProvider}
                  isSelected={selectedMethod === method.id}
                  onSelect={() => onSelectMethod(method.id)}
                />
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CountryPaymentMethods;
