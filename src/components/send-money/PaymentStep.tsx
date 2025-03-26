
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PaymentStepProps {
  transactionData: any;
  updateTransactionData: (data: Partial<any>) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  transactionData,
  updateTransactionData,
  onNext,
  onBack,
  isSubmitting = false
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-center text-muted-foreground mb-4">
          This component is currently being reimplemented.
        </p>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onBack} className="w-1/2" disabled={isSubmitting}>
            Back
          </Button>
          <Button onClick={onNext} className="w-1/2" disabled={isSubmitting}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentStep;
