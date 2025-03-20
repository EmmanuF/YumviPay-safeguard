
import { useState, useEffect } from 'react';
import { useNetwork } from '@/contexts/NetworkContext';
import { toast } from '@/hooks/use-toast';

export interface TransactionData {
  sendAmount: number;
  receiveAmount: number;
  sourceCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
  recipient?: {
    id?: string;
    name: string;
    contact: string;
    country: string;
  };
  paymentMethod?: {
    id: string;
    name: string;
    icon: string;
  };
  timestamp: string;
}

export function useSendMoneyTransaction(defaultCountryCode: string = 'CM') {
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isOffline } = useNetwork();

  // Initialize with data from local storage if available
  useEffect(() => {
    const initializeTransaction = () => {
      try {
        // Check if we have data from the calculator step
        let pendingTransactionData: string | null = localStorage.getItem('processedPendingTransaction');
        
        // If we didn't find processed transaction data, check for regular pending transaction
        if (!pendingTransactionData) {
          pendingTransactionData = localStorage.getItem('pendingTransaction');
        }
        
        if (pendingTransactionData) {
          const parsedData = JSON.parse(pendingTransactionData);
          console.log('Found transaction data in localStorage:', parsedData);
          
          // Initialize transaction data with the parsed data
          setTransactionData({
            sendAmount: parsedData.sendAmount || 0,
            receiveAmount: parsedData.receiveAmount || 0,
            sourceCurrency: parsedData.sourceCurrency || 'USD',
            targetCurrency: parsedData.targetCurrency || 'XAF',
            exchangeRate: parsedData.exchangeRate || 0,
            timestamp: parsedData.timestamp || new Date().toISOString(),
            // Add recipient and payment method if they exist
            ...(parsedData.recipient && { recipient: parsedData.recipient }),
            ...(parsedData.paymentMethod && { paymentMethod: parsedData.paymentMethod })
          });
          
          // Clear the processed pending transaction to avoid using it again
          localStorage.removeItem('processedPendingTransaction');
        } else {
          console.log('No pending transaction found, creating new transaction with defaults');
          
          // If no stored data is found, initialize with defaults
          setTransactionData({
            sendAmount: 100,
            receiveAmount: 61025, // Default based on common USD to XAF rate
            sourceCurrency: 'USD',
            targetCurrency: 'XAF',
            exchangeRate: 610.25,
            timestamp: new Date().toISOString()
          });
        }
        
        setIsInitialized(true);
      } catch (err) {
        console.error('Error initializing transaction:', err);
        setError('Failed to initialize transaction data');
        
        // Create a fallback transaction with defaults
        setTransactionData({
          sendAmount: 100,
          receiveAmount: 61025,
          sourceCurrency: 'USD',
          targetCurrency: 'XAF',
          exchangeRate: 610.25,
          timestamp: new Date().toISOString()
        });
        
        setIsInitialized(true);
        
        // Show error toast
        toast({
          title: 'Error Loading Transaction',
          description: 'Using default transaction data instead',
          variant: 'destructive'
        });
      }
    };
    
    if (!isInitialized) {
      initializeTransaction();
    }
  }, [isInitialized, defaultCountryCode, isOffline]);

  // Function to update the transaction data
  const updateTransactionData = (data: Partial<TransactionData>) => {
    setTransactionData(prev => {
      if (!prev) return data as TransactionData;
      return { ...prev, ...data };
    });
    
    // Store the updated data in localStorage
    try {
      const storedData = localStorage.getItem('pendingTransaction');
      const parsedData = storedData ? JSON.parse(storedData) : {};
      const updatedData = { ...parsedData, ...data };
      localStorage.setItem('pendingTransaction', JSON.stringify(updatedData));
    } catch (err) {
      console.error('Error updating transaction data in localStorage:', err);
    }
  };

  return {
    transactionData,
    updateTransactionData,
    isInitialized,
    error
  };
}
