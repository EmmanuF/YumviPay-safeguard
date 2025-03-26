
import { Transaction } from "@/types/transaction";
import { Recipient } from "@/types/recipient";
import { 
  calculateFee, 
  calculateTotal, 
  generateTransactionId, 
  getEstimatedDelivery
} from "@/utils/transactionUtils";
import { isOffline, addPausedRequest } from "@/utils/networkUtils";
import { 
  sendTransactionToSupabase, 
  addOfflineTransaction, 
  updateLocalTransaction 
} from "../utils/networkUtils";

// Create a new transaction
export const createTransaction = (
  amount: string,
  recipient: Recipient,
  paymentMethod: string,
  provider?: string,
  isRecurring: boolean = false,
  recurringPaymentId?: string
): Transaction => {
  const offline = isOffline();
  const fee = calculateFee(amount, recipient.country);
  const totalAmount = calculateTotal(amount, fee);
  
  // Create transaction object
  const transaction: Transaction = {
    id: generateTransactionId(),
    amount,
    fee,
    recipientId: recipient.id,
    recipientName: recipient.name,
    recipientContact: recipient.contact,
    paymentMethod,
    provider,
    country: recipient.country,
    status: offline ? 'offline-pending' : 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    estimatedDelivery: getEstimatedDelivery(recipient.country, paymentMethod),
    totalAmount,
    isRecurring: isRecurring || false,
    recurringPaymentId
  };
  
  if (offline) {
    // Store transaction locally if offline
    addOfflineTransaction(transaction);
    
    // Queue the Supabase insert for when connection is restored
    addPausedRequest(async () => {
      try {
        const result = await sendTransactionToSupabase({
          ...transaction,
          status: 'pending' // Change from offline-pending to pending
        });
        
        if (result && !result.error) {
          // Update the local transaction with server data
          updateLocalTransaction(transaction.id, {
            ...transaction,
            status: 'pending'
          });
        }
        
        return result;
      } catch (error) {
        console.error('Failed to sync transaction:', error);
        throw error;
      }
    });
    
    return transaction;
  }
  
  // Send to Supabase if online - but don't wait for response
  sendTransactionToSupabase(transaction).catch(error => {
    console.error('Failed to send transaction to Supabase:', error);
  });
  
  return transaction;
};
