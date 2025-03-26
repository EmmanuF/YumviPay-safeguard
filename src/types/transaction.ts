
// Transaction status types
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'offline-pending' | 'refunded';

// Transaction data interface
export interface Transaction {
  id: string;
  amount: string | number;
  sendAmount?: string | number;
  convertedAmount?: number;
  exchangeRate?: number;
  sourceCurrency?: string;
  targetCurrency?: string;
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
  totalAmount?: string | number;
  isRecurring?: boolean;
  recurringPaymentId?: string;
  date?: string; // Added date property for backward compatibility
  type?: string; // Added type property for backward compatibility
}
