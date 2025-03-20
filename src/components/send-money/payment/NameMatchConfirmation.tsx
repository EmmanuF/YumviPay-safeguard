
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface NameMatchConfirmationProps {
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
  showError?: boolean;
}

const NameMatchConfirmation: React.FC<NameMatchConfirmationProps> = ({
  isChecked,
  onCheckedChange,
  showError = false
}) => {
  console.log('NameMatchConfirmation: isChecked =', isChecked, 'showError =', showError);
  
  return (
    <div className={cn(
      "mt-6 p-4 rounded-lg border",
      showError ? "border-red-200 bg-red-50" : "border-gray-200 bg-gray-50"
    )}>
      <div className="flex items-start space-x-3">
        <Checkbox 
          id="confirm-details" 
          checked={isChecked}
          onCheckedChange={onCheckedChange}
          className={cn(
            "mt-1",
            showError ? "border-red-500" : ""
          )}
        />
        <div>
          <Label 
            htmlFor="confirm-details" 
            className={cn(
              "text-sm font-medium leading-none",
              showError ? "text-red-700" : "text-gray-900"
            )}
          >
            I confirm the recipient details are correct
          </Label>
          <p className={cn(
            "text-xs mt-1",
            showError ? "text-red-600" : "text-gray-500"
          )}>
            The name you entered must exactly match the name on the recipient's identification documents or account.
          </p>
          
          {showError && (
            <div className="flex items-start space-x-2 mt-2">
              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-600">
                You must confirm that the recipient details are correct before proceeding.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NameMatchConfirmation;
