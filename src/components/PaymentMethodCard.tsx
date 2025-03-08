
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronDown, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  name,
  description,
  icon,
  isSelected = false,
  onClick,
  options = [],
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
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
          
          <div className="mb-4">
            <Label htmlFor="recipientName" className="text-sm font-medium mb-2 block">
              Recipient Name
            </Label>
            <Input
              id="recipientName"
              placeholder="Enter recipient's full name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full"
            />
            <div className="mt-2 flex items-start gap-2 p-2 bg-amber-50 rounded-md">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-800">
                Important: The recipient name must exactly match the name registered on their {name.toLowerCase().includes('bank') ? 'bank account' : 'mobile money account'}. Mismatched names may cause transaction delays or funds being sent to the wrong person.
              </p>
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="accountNumber" className="text-sm font-medium mb-2 block">
              {name.toLowerCase().includes('bank') ? 'Account Number' : 'Mobile Number'}
            </Label>
            <Input
              id="accountNumber"
              placeholder={name.toLowerCase().includes('bank') ? "Enter account number" : "Enter mobile number"}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PaymentMethodCard;
