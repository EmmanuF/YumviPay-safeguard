
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getProviderById } from '@/data/cameroonPaymentProviders';

interface FormatHelpPopoverProps {
  providerId: string;
  isBankAccount: boolean;
}

const FormatHelpPopover: React.FC<FormatHelpPopoverProps> = ({ providerId, isBankAccount }) => {
  const providerDetails = getProviderById(providerId);
  
  if (!providerDetails) {
    return null;
  }
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center text-xs text-blue-600">
          <HelpCircle className="h-3.5 w-3.5 mr-1" />
          <span>Format help</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <h4 className="font-medium mb-2">{providerDetails.name} Format</h4>
        <p className="text-sm text-gray-600 mb-3">
          {isBankAccount
            ? "Bank account numbers are typically 10-20 digits, sometimes with spaces or dashes."
            : providerId === 'mtn_momo' 
              ? "MTN mobile numbers in Cameroon start with +237 followed by a 9-digit number starting with 6. Common MTN prefixes are 67, 68, 65, or 66."
              : "Orange mobile numbers in Cameroon start with +237 followed by a 9-digit number starting with 6. Common Orange prefixes are 69, 65, or 66."}
        </p>
        {providerDetails.instructions && Array.isArray(providerDetails.instructions) && providerDetails.instructions.length > 0 && (
          <div>
            <h5 className="text-sm font-medium mb-1">Tips:</h5>
            <ul className="list-disc pl-5 text-xs text-gray-700">
              {providerDetails.instructions.slice(0, 2).map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default FormatHelpPopover;
