
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import ExpandedContent from './ExpandedContent';
import { useLocale } from '@/contexts/LocaleContext';

interface PaymentMethodCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  options: Array<{
    id: string;
    name: string;
  }>;
  countryCode?: string; // Added country code
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  name,
  description,
  icon,
  isSelected,
  onClick,
  options,
  countryCode = 'CM', // Default to Cameroon
}) => {
  const { t } = useLocale();
  const [recipientName, setRecipientName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div
        className={`p-4 flex items-center justify-between cursor-pointer
                  ${isSelected ? 'bg-primary-50 border-b border-primary-100' : 'bg-white'}`}
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary-50 p-2 rounded-full">
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{t(`payment.${name.toLowerCase().replace(/\s+/g, '_')}`) || name}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <ChevronDown 
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 
                     ${isSelected ? 'rotate-180' : ''}`} 
        />
      </div>

      <AnimatePresence>
        {isSelected && (
          <ExpandedContent
            methodName={name}
            options={options}
            selectedOption={selectedOption}
            recipientName={recipientName}
            accountNumber={accountNumber}
            countryCode={countryCode}
            onOptionSelect={setSelectedOption}
            onRecipientNameChange={setRecipientName}
            onAccountNumberChange={setAccountNumber}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentMethodCard;
