
import React from 'react';
import { cn } from '@/lib/utils';

interface ProviderOptionsProps {
  options: Array<{
    id: string;
    name: string;
  }>;
  selectedOption: string;
  onSelect: (optionId: string) => void;
}

const ProviderOptions: React.FC<ProviderOptionsProps> = ({
  options,
  selectedOption,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => (
        <div
          key={option.id}
          onClick={() => onSelect(option.id)}
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
  );
};

export default ProviderOptions;
