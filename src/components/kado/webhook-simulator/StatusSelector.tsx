
import React from 'react';
import { Check, X } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface StatusSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({ value, onChange }) => {
  return (
    <div>
      <Label>Transaction Status</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex flex-col space-y-2 mt-2"
      >
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="completed" id="completed" className="mt-1" />
          <div className="grid gap-1">
            <Label htmlFor="completed" className="font-medium flex items-center">
              <Check className="h-4 w-4 mr-2 text-green-500" />
              Completed
            </Label>
            <p className="text-sm text-muted-foreground">
              Transaction was successful and funds were sent
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="failed" id="failed" className="mt-1" />
          <div className="grid gap-1">
            <Label htmlFor="failed" className="font-medium flex items-center">
              <X className="h-4 w-4 mr-2 text-red-500" />
              Failed
            </Label>
            <p className="text-sm text-muted-foreground">
              Transaction failed and no funds were sent
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default StatusSelector;
