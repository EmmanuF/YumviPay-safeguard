
import React from 'react';
import PreferredPaymentMethods from './PreferredPaymentMethods';

interface PreferredMethodsSectionProps {
  preferredMethods: Array<{methodId: string; providerId: string}>;
  countryCode: string;
  selectedCountry: any;
  transactionData: any;
  updateTransactionData: (data: Partial<any>) => void;
}

const PreferredMethodsSection: React.FC<PreferredMethodsSectionProps> = ({
  preferredMethods,
  countryCode,
  selectedCountry,
  transactionData,
  updateTransactionData
}) => {
  if (preferredMethods.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2 text-muted-foreground">Your preferred methods</h3>
      <PreferredPaymentMethods
        preferredMethods={preferredMethods}
        countryCode={countryCode}
        selectedCountry={selectedCountry}
        transactionData={transactionData}
        updateTransactionData={updateTransactionData}
      />
    </div>
  );
};

export default PreferredMethodsSection;
