
import React from 'react';
import { motion } from 'framer-motion';
import { getProviderById } from '@/data/cameroonPaymentProviders';
import { getProviderOptions } from '@/utils/paymentUtils';

interface PreferredPaymentMethodsProps {
  preferredMethods: Array<{ methodId: string; providerId: string }>;
  countryCode: string;
  selectedCountry: any;
  transactionData: any;
  updateTransactionData: (data: Partial<any>) => void;
}

const PreferredPaymentMethods: React.FC<PreferredPaymentMethodsProps> = ({
  preferredMethods,
  countryCode,
  selectedCountry,
  transactionData,
  updateTransactionData,
}) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  if (preferredMethods.length === 0) {
    return null;
  }

  return (
    <motion.div variants={itemVariants} className="mb-4">
      <div className="space-y-2">
        {preferredMethods.map((method, index) => {
          if (countryCode === 'CM' && method.methodId === 'mobile_money') {
            if (method.providerId !== 'mtn_momo' && method.providerId !== 'orange_money') {
              return null;
            }
          }
          
          const methodDetails = selectedCountry?.paymentMethods.find(m => m.id === method.methodId);
          if (!methodDetails) return null;
          
          const providers = getProviderOptions(method.methodId, countryCode);
          const provider = providers.find(p => p.id === method.providerId);
          if (!provider) return null;
          
          const providerData = method.methodId === 'mobile_money' ? 
            getProviderById(method.methodId, method.providerId) : undefined;
          
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
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center overflow-hidden">
                  {providerData?.logoUrl ? (
                    <img 
                      src={providerData.logoUrl} 
                      alt={provider.name} 
                      className="h-8 w-8 object-contain" 
                    />
                  ) : (
                    <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
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
  );
};

export default PreferredPaymentMethods;
