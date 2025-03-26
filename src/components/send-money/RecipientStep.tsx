
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface RecipientStepProps {
  transactionData: any;
  updateTransactionData: (data: Partial<any>) => void;
  onNext: () => void;
  onBack: () => void;
}

const RecipientStep: React.FC<RecipientStepProps> = ({
  transactionData,
  updateTransactionData,
  onNext,
  onBack
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-center text-muted-foreground mb-4">
          This component is currently being reimplemented.
        </p>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onBack} className="w-1/2">
            Back
          </Button>
          <Button onClick={onNext} className="w-1/2">
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipientStep;
