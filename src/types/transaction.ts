
// Transaction status types
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'offline-pending';

// Transaction data interface
export interface Transaction {
  id: string;
  amount: string | number;
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
}
