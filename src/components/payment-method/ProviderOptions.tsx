
import React from 'react';
import { cn } from '@/lib/utils';
import { useLocale } from '@/contexts/LocaleContext';
import { getProviderById } from '@/data/cameroonPaymentProviders';

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

  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => {
        // Try to get enhanced provider data
        const providerDetails = methodId ? getProviderById(methodId, option.id) : undefined;
        
        return (
          <div
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={cn(
              "p-3 rounded-md border cursor-pointer transition-all flex flex-col items-center justify-center",
              selectedOption === option.id
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            {providerDetails?.logoUrl ? (
              <div className="mb-2 flex items-center justify-center h-8">
                <img 
                  src={providerDetails.logoUrl} 
                  alt={option.name} 
                  className="h-full object-contain max-w-[80px]" 
                />
              </div>
            ) : null}
            <div className="text-center">
              {t(`payment.${option.id}`) || option.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProviderOptions;
