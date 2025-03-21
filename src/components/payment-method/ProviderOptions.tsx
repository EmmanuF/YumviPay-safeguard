
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLocale } from '@/contexts/LocaleContext';
import { getProviderById } from '@/data/cameroonPaymentProviders';
import { Shield, Award } from 'lucide-react';

interface ProviderOptionsProps {
  options: Array<{
    id: string;
    name: string;
  }>;
  selectedOption: string;
  onSelect: (optionId: string) => void;
  methodId?: string;
}

const ProviderOptions: React.FC<ProviderOptionsProps> = ({
  options,
  selectedOption,
  onSelect,
  methodId = 'mobile_money',
}) => {
  const { t } = useLocale();
  
  // Auto-select the first option if none is selected
  useEffect(() => {
    if (options.length > 0 && !selectedOption) {
      onSelect(options[0].id);
    }
  }, [options, selectedOption, onSelect]);

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => {
        // Get enhanced provider data
        const providerDetails = methodId ? getProviderById(option.id) : undefined;
        const isPopular = providerDetails?.isRecommended || false;
        
        return (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(option.id)}
            className={cn(
              "p-4 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center justify-center relative",
              selectedOption === option.id
                ? "border-primary-500 bg-primary-50 text-primary-700 shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
            )}
          >
            {isPopular && (
              <div className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full px-2 py-0.5 text-xs font-medium flex items-center">
                <Award className="h-3 w-3 mr-1" />
                <span>Popular</span>
              </div>
            )}
            
            {providerDetails?.logoUrl ? (
              <div className="mb-3 flex items-center justify-center h-12 w-full">
                <img 
                  src={providerDetails.logoUrl} 
                  alt={option.name} 
                  className="h-full object-contain max-w-[100px]" 
                />
              </div>
            ) : null}
            
            <div className="text-center font-medium">
              {t(`payment.${option.id}`) || option.name}
            </div>
            
            {providerDetails && (
              <div className="mt-1 text-xs text-gray-500 flex items-center justify-center">
                <Shield className="h-3 w-3 mr-1 text-green-500" />
                {methodId === 'mobile_money' ? 'Instant Transfer' : '1-2 Business Days'}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProviderOptions;
