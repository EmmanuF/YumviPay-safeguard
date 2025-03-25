
// Transaction status types
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'offline-pending';

// Transaction data interface
export interface Transaction {
  id: string;
  amount: string | number;
  sendAmount?: string | number; // Add sendAmount property
  currency?: string;
  fee?: string | number;
  recipientId?: string;
  recipientName: string;
  recipientContact?: string;
  recipientCountry?: string;
  recipientCountryCode?: string;
  paymentMethod?: string;
  provider?: string;
  country: string;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt?: Date;
  completedAt?: Date;
  failureReason?: string;
  estimatedDelivery?: string;
  exchangeRate?: number;
  totalAmount?: string | number;
  date?: string;
  type?: string;
  isRecurring?: boolean;
  recurringPaymentId?: string;
  recurringFrequency?: string;
  convertedAmount?: number; // Add this to match what we're storing
  receiveAmount?: string; // Add this to match what we're storing
  sourceCurrency?: string; // Add this to ensure currency conversion info is available
  targetCurrency?: string; // Add this to ensure currency conversion info is available
}
