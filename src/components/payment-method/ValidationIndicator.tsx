
import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ValidationIndicatorProps {
  isValid: boolean;
  accountNumber: string;
  errorMessage: string | null;
  isBankAccount: boolean;
}

const ValidationIndicator: React.FC<ValidationIndicatorProps> = ({ 
  isValid, 
  accountNumber, 
  errorMessage, 
  isBankAccount 
}) => {
  if (!accountNumber) return null;
  
  return (
    <>
      {/* Status icon */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {isValid ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-amber-500" />
        )}
      </div>
      
      {/* Error message */}
      {errorMessage && (
        <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
      )}
      
      {/* Success message */}
      {isValid && accountNumber && (
        <p className="text-xs text-green-600 mt-1">
          {isBankAccount ? "Valid account format" : "Valid mobile number format"}
        </p>
      )}
    </>
  );
};

export default ValidationIndicator;
