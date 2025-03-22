
import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ValidationStatusIndicatorProps {
  isValid: boolean;
  hasInput: boolean;
  message: string | null;
  isBankAccount?: boolean;
}

const ValidationStatusIndicator: React.FC<ValidationStatusIndicatorProps> = ({
  isValid,
  hasInput,
  message,
  isBankAccount = false
}) => {
  return (
    <>
      {hasInput && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isValid ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          )}
        </div>
      )}
      
      {message && (
        <p className="text-xs text-red-500 mt-1">{message}</p>
      )}
      
      {isValid && hasInput && (
        <p className="text-xs text-green-600 mt-1">
          {isBankAccount ? "Valid account format" : "Valid mobile number format"}
        </p>
      )}
    </>
  );
};

export default ValidationStatusIndicator;
