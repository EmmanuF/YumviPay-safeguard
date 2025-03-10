
import { Transaction } from "@/types/transaction";

// Initialize with some mock transactions for demo
export const mockTransactions: Transaction[] = [
  {
    id: "ABC12345",
    amount: "250.00",
    fee: "6.74",
    recipientId: "rec1",
    recipientName: "John Doe",
    recipientContact: "+234 701 234 5678",
    paymentMethod: "mobile_money",
    provider: "mtn_momo",
    country: "NG",
    status: "completed",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    estimatedDelivery: "Within 15 minutes",
    totalAmount: "256.74"
  },
  {
    id: "DEF67890",
    amount: "100.00",
    fee: "4.49",
    recipientId: "rec2",
    recipientName: "Mary Johnson",
    recipientContact: "+233 55 123 4567",
    paymentMethod: "bank_transfer",
    provider: "ecobank",
    country: "GH",
    status: "failed",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    failureReason: "Bank account validation failed",
    estimatedDelivery: "1-2 business days",
    totalAmount: "104.49"
  }
];
