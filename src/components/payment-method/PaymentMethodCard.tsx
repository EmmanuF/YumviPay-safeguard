
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronDown, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import ExpandedContent from './ExpandedContent';

interface PaymentMethodCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  isSelected?: boolean;
  onClick: () => void;
  options?: Array<{
    id: string;
    name: string;
    logoUrl?: string;
  }>;
  countryCode?: string;
  selectedOption?: string;
  onOptionSelect?: (optionId: string) => void;
  isRecommended?: boolean;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  name,
  description,
  icon,
  isSelected = false,
  onClick,
  options = [],
  countryCode = 'CM',
  selectedOption = '',
  onOptionSelect,
  isRecommended = false
}) => {
  const [expanded, setExpanded] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');

  const handleClick = () => {
    onClick();
    if (options.length > 0 && !expanded) {
      setExpanded(true);
    }
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <div className="mb-4">
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className={cn(
          "glass-effect w-full rounded-xl p-4 flex items-center justify-between cursor-pointer",
          "transition-all duration-200",
          isSelected 
            ? "ring-2 ring-primary-500 shadow-md" 
            : "hover:bg-secondary-50/90 hover:shadow-md"
        )}
      >
        <div className="flex items-center">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center mr-4",
            isSelected ? "bg-primary-100" : "bg-secondary-100"
          )}>
            {icon}
          </div>
          <div>
            <div className="flex items-center">
              <h3 className="font-medium text-foreground">{name}</h3>
              {isRecommended && (
                <div className="ml-2 flex items-center text-amber-500">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span className="text-xs ml-1">Recommended</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        {options.length > 0 ? (
          <button onClick={toggleExpand} className="ml-2">
            {expanded ? 
              <ChevronDown className={cn(
                "w-5 h-5 transition-colors",
                isSelected ? "text-primary-500" : "text-gray-400"
              )} /> : 
              <ChevronRight className={cn(
                "w-5 h-5 transition-colors",
                isSelected ? "text-primary-500" : "text-gray-400"
              )} />
            }
          </button>
        ) : (
          <ChevronRight className={cn(
            "w-5 h-5 transition-colors",
            isSelected ? "text-primary-500" : "text-gray-400"
          )} />
        )}
      </motion.div>

      {/* Expanded section for options */}
      {expanded && options.length > 0 && (
        <ExpandedContent
          methodName={name}
          options={options}
          selectedOption={selectedOption}
          recipientName={recipientName}
          accountNumber={accountNumber}
          countryCode={countryCode}
          onOptionSelect={onOptionSelect || (() => {})}
          onRecipientNameChange={setRecipientName}
          onAccountNumberChange={setAccountNumber}
        />
      )}
    </div>
  );
};

export default PaymentMethodCard;
