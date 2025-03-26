
/**
 * Transaction creation utility specifically for Kado integration
 */

import { createTransaction } from './store';
import { generateTransactionId } from '@/utils/transactionUtils';
import { formatCurrency } from '@/utils/formatUtils';

export interface KadoTransactionData {
  amount: number;
  recipientName: string;
  recipientContact: string;
  country: string;
  paymentMethod: string;
  selectedProvider?: string;
  sourceCurrency: string;
  targetCurrency: string;
  convertedAmount: number;
  exchangeRate: number;
}

/**
 * Creates a new transaction for Kado processing
 */
export const createKadoTransaction = async (data: KadoTransactionData) => {
  try {
    console.log('Creating Kado transaction with data:', data);
    
    // Generate a unique transaction ID
    const transactionId = generateTransactionId();
    
    // Format the amount values
    const formattedAmount = formatCurrency(data.amount, data.sourceCurrency, false);
    const formattedConvertedAmount = formatCurrency(data.convertedAmount, data.targetCurrency, false);
    
    // Create a transaction record
    const transaction = await createTransaction({
      id: transactionId,
      amount: data.amount.toString(),
      recipientName: data.recipientName,
      recipientContact: data.recipientContact,
      country: data.country,
      status: 'pending',
      paymentMethod: data.paymentMethod,
      provider: data.selectedProvider,
      
      // Additional currency information
      sourceCurrency: data.sourceCurrency,
      targetCurrency: data.targetCurrency,
      convertedAmount: data.convertedAmount,
      exchangeRate: data.exchangeRate,
      
      // Display information
      displayAmount: formattedAmount,
      displayConvertedAmount: formattedConvertedAmount,
      estimatedDelivery: 'Processing via Kado'
    });
    
    console.log('Transaction created:', transaction);
    return transaction;
  } catch (error) {
    console.error('Error creating Kado transaction:', error);
    throw error;
  }
};
