
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface PaymentStepHeaderProps {
  amount: number;
  sourceCurrency: string;
  recipientName: string;
}

const PaymentStepHeader: React.FC<PaymentStepHeaderProps> = ({
  amount,
  sourceCurrency,
  recipientName
}) => {
  return (
    <CardHeader className="pb-2">
      <CardTitle className="text-xl">Select Payment Method</CardTitle>
      <CardDescription>
        Choose how you want to send {amount} {sourceCurrency} to {recipientName || 'your recipient'}
      </CardDescription>
    </CardHeader>
  );
};

export default PaymentStepHeader;
