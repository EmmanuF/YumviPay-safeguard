
export interface Country {
  name: string;
  code: string;
  flagUrl: string;
  currency: string;
  isSendingEnabled: boolean;
  isReceivingEnabled: boolean;
  paymentMethods: PaymentMethod[];
  phonePrefix?: string; // Add the phonePrefix property as optional
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  fees: string;
  processingTime: string;
  providers?: string[]; // Add providers as an optional array of strings
}
