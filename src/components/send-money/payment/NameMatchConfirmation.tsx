
import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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
      <Alert 
        variant={showError ? "destructive" : "warning"}
        className={`
          relative overflow-hidden
          ${showError 
            ? 'border-red-200 bg-red-50 text-red-800' 
            : 'border-amber-200 bg-amber-50 text-amber-800'}
        `}
      >
        {/* Decorative accent line at the top */}
        <div 
          className={`absolute top-0 left-0 w-full h-1 
            ${showError 
              ? 'bg-gradient-to-r from-red-400/30 via-red-500 to-red-400/30' 
              : 'bg-gradient-to-r from-amber-400/30 via-amber-500 to-amber-400/30'}`
          }
        />
        
        {showError ? (
          <AlertCircle 
            className="h-5 w-5 text-red-500" 
            aria-hidden="true"
          />
        ) : (
          <AlertTriangle 
            className="h-5 w-5 text-amber-500" 
            aria-hidden="true"
          />
        )}
        
        <AlertTitle className={`text-base font-medium mb-1 ${showError ? 'text-red-700' : 'text-amber-800'}`}>
          Confirm recipient details
        </AlertTitle>
        
        <AlertDescription className={`text-sm ${showError ? 'text-red-600' : 'text-amber-700'}`}>
          Before proceeding, please verify that you have entered the recipient's name 
          <span className="font-semibold"> EXACTLY </span> 
          as it appears on their account. Mismatched names may result in failed transfers or funds being sent to the wrong person.
        </AlertDescription>
        
        <div className="mt-4 flex items-start gap-3">
          <Checkbox 
            id="recipient-confirmation" 
            checked={isChecked} 
            onCheckedChange={onCheckedChange} 
            className={`mt-0.5 ${showError 
              ? 'border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white' 
              : 'border-amber-500 data-[state=checked]:bg-amber-500 data-[state=checked]:text-white'
            }`}
          />
          <label 
            htmlFor="recipient-confirmation" 
            className={`text-sm cursor-pointer ${showError 
              ? 'font-medium text-red-700' 
              : 'text-amber-800'
            }`}
          >
            I confirm that I have verified the recipient's name and details are correct
          </label>
        </div>
        
        {showError && (
          <div className="mt-3 px-3 py-2 rounded bg-red-100 border border-red-200 text-sm text-red-700 font-medium">
            You must confirm that the recipient details are correct to continue
          </div>
        )}
      </Alert>
    </div>
  );
};

export default NameMatchConfirmation;
