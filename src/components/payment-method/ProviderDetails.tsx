
import React from 'react';
import { Clock, PiggyBank, Phone } from 'lucide-react';

interface ProviderDetailsProps {
  providerDetails: {
    processingTime?: string;
    fees?: {
      percentage: number;
      fixed: number;
      currency: string;
    };
    limits?: {
      min: number;
      max: number;
      currency: string;
    };
    supportPhone?: string;
    instructions?: string[];
  } | undefined;
}

const ProviderDetails: React.FC<ProviderDetailsProps> = ({ providerDetails }) => {
  if (!providerDetails) return null;

  return (
    <div className="mt-4 space-y-3">
      {/* Processing time */}
      {providerDetails.processingTime && (
        <div className="p-3 bg-blue-50 rounded-lg flex items-start gap-2">
          <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-800">Processing Time</h4>
            <p className="text-sm text-blue-700">
              {providerDetails.processingTime}
            </p>
          </div>
        </div>
      )}
      
      {/* Fees information */}
      {providerDetails.fees && (
        <div className="p-3 bg-purple-50 rounded-lg flex items-start gap-2">
          <PiggyBank className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-purple-800">Transaction Fees</h4>
            <p className="text-sm text-purple-700">
              {providerDetails.fees.percentage}% + {providerDetails.fees.fixed} {providerDetails.fees.currency}
            </p>
            {providerDetails.limits && (
              <p className="text-xs text-purple-600 mt-1">
                Transaction limits: {providerDetails.limits.min} - {providerDetails.limits.max} {providerDetails.limits.currency}
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Support information */}
      {providerDetails.supportPhone && (
        <div className="p-3 bg-green-50 rounded-lg flex items-start gap-2">
          <Phone className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-green-800">Customer Support</h4>
            <p className="text-sm text-green-700">
              {providerDetails.supportPhone}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDetails;
