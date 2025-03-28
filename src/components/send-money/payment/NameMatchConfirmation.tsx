
import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface NameMatchConfirmationProps {
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
  showError?: boolean;
  variant?: 'recipient' | 'payment';
}

const NameMatchConfirmation: React.FC<NameMatchConfirmationProps> = ({
  isChecked,
  onCheckedChange,
  showError = false,
  variant = 'payment'
}) => {
  const isRecipientVariant = variant === 'recipient';
  
  const title = isRecipientVariant 
    ? "Confirm recipient details" 
    : "Terms & Conditions";
    
  const description = isRecipientVariant
    ? "Before proceeding, please verify that you have entered the recipient's name EXACTLY as it appears on their account. Mismatched names may result in failed transfers or funds being sent to the wrong person."
    : "I accept the Terms & Conditions and Privacy Policy. I confirm that I am the rightful owner of the funds being transferred and that this transaction does not violate any laws.";

  return (
    <div className="mt-6">
      <Alert 
        variant={showError ? "destructive" : "warning"}
        className={`
          rounded-xl shadow-lg relative overflow-hidden border-2
          ${showError 
            ? 'border-red-300 bg-red-50 text-red-800' 
            : 'border-amber-300 bg-amber-50 text-amber-800'}
        `}
      >
        {/* Decorative accent line at the top */}
        <div 
          className={`absolute top-0 left-0 w-full h-2 
            ${showError 
              ? 'bg-gradient-to-r from-red-400 via-red-500 to-red-400' 
              : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400'}`
          }
        />
        
        {showError ? (
          <AlertCircle 
            className="h-7 w-7 text-red-500 absolute left-4 top-5" 
            aria-hidden="true"
          />
        ) : (
          <AlertTriangle 
            className="h-7 w-7 text-amber-500 absolute left-4 top-5" 
            aria-hidden="true"
          />
        )}
        
        <div className="pl-12">
          <AlertTitle className={`text-base font-semibold mb-2 ${showError ? 'text-red-700' : 'text-amber-800'}`}>
            {title}
          </AlertTitle>
          
          <AlertDescription className={`text-sm ${showError ? 'text-red-600' : 'text-amber-700'}`}>
            {description}
          </AlertDescription>
        </div>
        
        <div className="mt-5 flex items-start gap-4 pl-12">
          <Checkbox 
            id="confirmation-checkbox" 
            checked={isChecked} 
            onCheckedChange={onCheckedChange} 
            className={`mt-0.5 h-5 w-5 ${showError 
              ? 'border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white' 
              : 'border-amber-500 data-[state=checked]:bg-amber-500 data-[state=checked]:text-white'
            }`}
          />
          <label 
            htmlFor="confirmation-checkbox" 
            className={`text-sm cursor-pointer ${showError 
              ? 'font-medium text-red-700' 
              : 'font-medium text-amber-800'
            }`}
          >
            {isRecipientVariant 
              ? "I confirm that I have verified the recipient's name and details are correct"
              : "I agree to the Terms & Conditions"}
          </label>
        </div>
        
        {showError && (
          <div className="mt-4 mx-12 px-4 py-3 rounded-lg bg-red-100 border border-red-200 text-sm text-red-700 font-medium">
            {isRecipientVariant
              ? "You must confirm that the recipient details are correct to continue"
              : "You must accept the Terms & Conditions to continue"}
          </div>
        )}
      </Alert>
    </div>
  );
};

export default NameMatchConfirmation;
