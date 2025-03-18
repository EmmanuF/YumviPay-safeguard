
import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

interface VerificationStatusProps {
  isValid: boolean;
  hasVerified: boolean;
  verificationMessage: string;
  recipientName: string;
  accountNumber: string;
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({
  isValid,
  hasVerified,
  verificationMessage,
  recipientName,
  accountNumber
}) => {
  if (!recipientName || !accountNumber) return null;
  
  if (hasVerified && isValid) {
    return (
      <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-start gap-2">
        <Shield className="h-5 w-5 text-green-600 mt-0.5" />
        <div>
          <h4 className="font-medium text-green-800">Verification Passed</h4>
          <p className="text-sm text-green-700">
            The recipient information format has been verified.
          </p>
        </div>
      </div>
    );
  }

  if (verificationMessage && !isValid) {
    return (
      <div className="mt-4 p-3 bg-amber-50 rounded-lg flex items-start gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
        <div>
          <h4 className="font-medium text-amber-800">Verification Issue</h4>
          <p className="text-sm text-amber-700">{verificationMessage}</p>
        </div>
      </div>
    );
  }
  
  return null;
};

export default VerificationStatus;
