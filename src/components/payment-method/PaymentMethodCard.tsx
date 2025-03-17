
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RecipientInfo from './RecipientInfo';

interface PaymentMethodCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  isSelected?: boolean;
  onClick: () => void;
  options?: Array<{
    id: string;
    name: string;
  }>;
  countryCode?: string;
  selectedOption?: string;
  onOptionSelect?: (optionId: string) => void;
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
  onOptionSelect
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

  const handleOptionSelect = (optionId: string) => {
    if (onOptionSelect) {
      onOptionSelect(optionId);
    }
    setSelectedOption(optionId);
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
            : "hover:bg-white/90 hover:shadow-md"
        )}
      >
        <div className="flex items-center">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center mr-4",
            isSelected ? "bg-primary-100" : "bg-gray-100"
          )}>
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-foreground">{name}</h3>
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
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-100"
        >
          <div className="mb-4">
            <Label htmlFor="provider" className="text-sm font-medium mb-2 block">Select Provider</Label>
            <div className="grid grid-cols-2 gap-2">
              {options.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className={cn(
                    "p-3 rounded-md border text-center cursor-pointer transition-all",
                    selectedOption === option.id
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  {option.name}
                </div>
              ))}
            </div>
          </div>
          
          <RecipientInfo
            methodName={name}
            recipientName={recipientName}
            accountNumber={accountNumber}
            onRecipientNameChange={setRecipientName}
            onAccountNumberChange={setAccountNumber}
            countryCode={countryCode}
          />
        </motion.div>
      )}
    </div>
  );
};

export default PaymentMethodCard;
