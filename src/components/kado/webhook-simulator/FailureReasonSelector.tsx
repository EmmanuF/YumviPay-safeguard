
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface FailureReasonSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const FailureReasonSelector: React.FC<FailureReasonSelectorProps> = ({ value, onChange }) => {
  const failureReasons = [
    { value: 'payment_failed', label: 'Payment failed' },
    { value: 'insufficient_funds', label: 'Insufficient funds' },
    { value: 'kyc_rejected', label: 'KYC verification rejected' },
    { value: 'suspicious_activity', label: 'Suspicious activity detected' },
    { value: 'invalid_recipient', label: 'Invalid recipient information' },
  ];

  return (
    <div>
      <Label htmlFor="reason">Failure Reason</Label>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger id="reason" className="mt-1">
          <SelectValue placeholder="Select reason" />
        </SelectTrigger>
        <SelectContent>
          {failureReasons.map((reason) => (
            <SelectItem key={reason.value} value={reason.value}>
              {reason.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FailureReasonSelector;
