
import React from 'react';
import { Input } from '@/components/ui/input';

interface AmountInputProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  className?: string;
}

const AmountInput: React.FC<AmountInputProps> = ({ 
  label, 
  value, 
  onChange, 
  readOnly = false,
  className = ''
}) => {
  return (
    <div className={`bg-secondary-50 rounded-xl p-4 ${className}`}>
      <label className="text-sm text-gray-500 mb-1 block">{label}</label>
      <div className="flex">
        {readOnly ? (
          <div className="text-xl font-medium flex-1">{value}</div>
        ) : (
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            className="border-0 text-xl font-medium bg-transparent flex-1 focus-visible:ring-0"
          />
        )}
      </div>
    </div>
  );
};

export default AmountInput;
