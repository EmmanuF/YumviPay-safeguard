
// Transaction status types
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Transaction data interface
export interface Transaction {
  id: string;
  amount: string;
  fee: string;
  recipientId: string;
  recipientName: string;
  recipientContact: string;
  paymentMethod: string;
  provider?: string;
  country: string;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  failureReason?: string;
  estimatedDelivery: string;
  exchangeRate?: number;
  totalAmount: string;
  
  // Additional properties to align with usage in other components
  recipientCountry?: string;
  recipientCountryCode?: string;
  date?: string;
  type?: string;
  currency?: string;
}
