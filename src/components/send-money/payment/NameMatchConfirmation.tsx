
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

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
  return (
    <div className="mt-6">
      <div className={`p-4 ${showError ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'} border rounded-md`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className={`h-5 w-5 flex-shrink-0 ${showError ? 'text-red-500' : 'text-amber-500'} mt-0.5`} />
          <div>
            <p className={`font-medium ${showError ? 'text-red-700' : 'text-amber-800'}`}>
              Confirm recipient details
            </p>
            <p className={`text-sm mt-1 ${showError ? 'text-red-600' : 'text-amber-700'}`}>
              Before proceeding, please verify that you have entered the recipient's name EXACTLY as it appears on their account. Mismatched names may result in failed transfers or funds being sent to the wrong person.
            </p>
            
            <div className="mt-4 flex items-start gap-2">
              <Checkbox 
                id="recipient-confirmation" 
                checked={isChecked} 
                onCheckedChange={onCheckedChange} 
                className={showError ? 'border-red-500 data-[state=checked]:bg-red-500' : ''}
              />
              <label 
                htmlFor="recipient-confirmation" 
                className={`text-sm ${showError ? 'font-medium text-red-700' : 'text-amber-800'}`}
              >
                I confirm that I have verified the recipient's name and details are correct
              </label>
            </div>
            
            {showError && (
              <p className="mt-2 text-sm text-red-600 font-medium">
                You must confirm that the recipient details are correct to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameMatchConfirmation;
