
import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface NameMatchConfirmationProps {
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
  showError?: boolean;
}

const NameMatchConfirmation: React.FC<NameMatchConfirmationProps> = ({
  isChecked,
  onCheckedChange,
  showError = false,
}) => {
  return (
    <div className={cn(
      "p-4 rounded-lg border mb-4",
      showError 
        ? "bg-red-50 border-red-200" 
        : isChecked 
          ? "bg-green-50 border-green-200" 
          : "bg-accent-50 border-accent-200"
    )}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {showError ? (
            <AlertTriangle className="h-5 w-5 text-red-500" />
          ) : isChecked ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-accent-500" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className={cn(
            "text-sm font-medium",
            showError ? "text-red-800" : isChecked ? "text-green-800" : "text-accent-800"
          )}>
            IMPORTANT: Verify name and number match exactly
          </h3>
          
          <p className={cn(
            "text-xs mt-1",
            showError ? "text-red-700" : isChecked ? "text-green-700" : "text-accent-700"
          )}>
            The recipient name and contact number/account must <strong>exactly match</strong> what's 
            registered with the payment provider. Mismatched details can result in transaction 
            delays, failed transfers, or permanent loss of funds.
          </p>
          
          <div className="mt-3 flex items-start gap-2">
            <Checkbox 
              id="name-match-confirmation" 
              checked={isChecked}
              onCheckedChange={onCheckedChange}
              className={cn(
                showError ? "border-red-500" : "",
                isChecked ? "text-green-500" : ""
              )}
            />
            <Label 
              htmlFor="name-match-confirmation" 
              className={cn(
                "text-xs cursor-pointer",
                showError ? "text-red-700" : isChecked ? "text-green-700" : "text-accent-700"
              )}
            >
              I confirm that the recipient name and number/account exactly match the details 
              registered with the payment provider.
            </Label>
          </div>
          
          {showError && (
            <p className="text-xs text-red-600 mt-2">
              Please confirm the recipient details match before proceeding.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NameMatchConfirmation;
