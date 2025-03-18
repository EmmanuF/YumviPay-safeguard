import { Transaction } from "@/types/transaction";
import { isOffline, addPausedRequest } from "@/utils/networkUtils";
import { toast } from "@/hooks/use-toast";
import { isPlatform } from "@/utils/platformUtils";
import { formatCurrency } from "@/utils/formatUtils";

// Store receipts in localStorage
const RECEIPT_STORAGE_KEY = 'yumvi_receipts';

export interface TransactionReceipt {
  id: string;
  transactionId: string;
  recipientName: string;
  recipientContact: string;
  amount: number;
  fee: number;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  generatedAt: Date;
  pdfUrl?: string;
  htmlContent?: string;
}

// Get all stored receipts
export const getStoredReceipts = (): TransactionReceipt[] => {
  try {
    const receiptsJson = localStorage.getItem(RECEIPT_STORAGE_KEY);
    return receiptsJson ? JSON.parse(receiptsJson) : [];
  } catch (error) {
    console.error('Error retrieving stored receipts:', error);
    return [];
  }
};

// Save a receipt to local storage
export const storeReceipt = (receipt: TransactionReceipt): void => {
  try {
    const receipts = getStoredReceipts();
    
    // Check if this receipt already exists
    const existingIndex = receipts.findIndex(r => r.id === receipt.id);
    
    if (existingIndex >= 0) {
      // Update existing receipt
      receipts[existingIndex] = receipt;
    } else {
      // Add new receipt
      receipts.push(receipt);
    }
    
    localStorage.setItem(RECEIPT_STORAGE_KEY, JSON.stringify(receipts));
  } catch (error) {
    console.error('Error storing receipt:', error);
  }
};

// Delete a receipt from storage
export const deleteReceipt = (receiptId: string): void => {
  try {
    const receipts = getStoredReceipts();
    const updatedReceipts = receipts.filter(r => r.id !== receiptId);
    localStorage.setItem(RECEIPT_STORAGE_KEY, JSON.stringify(updatedReceipts));
  } catch (error) {
    console.error('Error deleting receipt:', error);
  }
};

// Convert string to number safely
const safeParseNumber = (value: string | number | undefined): number => {
  if (value === undefined) return 0;
  if (typeof value === 'number') return value;
  return parseFloat(value) || 0;
};

// Format date
const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

// Generate an HTML receipt
export const generateHtmlReceipt = (transaction: Transaction): string => {
  const date = transaction.completedAt || transaction.updatedAt || transaction.createdAt;
  const amount = safeParseNumber(transaction.amount);
  const fee = safeParseNumber(transaction.fee || 0);
  const totalAmount = safeParseNumber(transaction.totalAmount || amount);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Transaction Receipt - ${transaction.id}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .receipt {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .receipt-header {
          text-align: center;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .receipt-header h1 {
          color: #6366f1;
          margin: 0;
          font-size: 24px;
        }
        .receipt-header p {
          color: #666;
          margin: 5px 0 0;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 10px;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: bold;
          color: #555;
        }
        .value {
          text-align: right;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
          margin-top: 20px;
          font-size: 18px;
          border-top: 2px solid #f0f0f0;
          padding-top: 15px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          color: #999;
        }
        .status {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 4px;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 12px;
        }
        .status-completed {
          background-color: #ecfdf5;
          color: #059669;
        }
        .status-pending {
          background-color: #fffbeb;
          color: #d97706;
        }
        .status-failed {
          background-color: #fef2f2;
          color: #dc2626;
        }
        .logo {
          max-width: 150px;
          margin: 0 auto 10px;
          display: block;
        }
        @media print {
          body {
            padding: 0;
            margin: 0;
          }
          .receipt {
            border: none;
            padding: 10px;
          }
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="receipt-header">
          <h1>Yumvi Pay</h1>
          <p>Transaction Receipt</p>
          <p>${formatDate(date)}</p>
          <p>
            <span class="status status-${transaction.status === 'completed' ? 'completed' : (transaction.status === 'pending' || transaction.status === 'processing') ? 'pending' : 'failed'}">
              ${transaction.status}
            </span>
          </p>
        </div>
        
        <div class="info-row">
          <span class="label">Transaction ID:</span>
          <span class="value">${transaction.id}</span>
        </div>
        
        <div class="info-row">
          <span class="label">Recipient:</span>
          <span class="value">${transaction.recipientName}</span>
        </div>
        
        <div class="info-row">
          <span class="label">Country:</span>
          <span class="value">${transaction.country}</span>
        </div>
        
        <div class="info-row">
          <span class="label">Payment Method:</span>
          <span class="value">${transaction.paymentMethod || 'N/A'}</span>
        </div>
        
        <div class="info-row">
          <span class="label">Provider:</span>
          <span class="value">${transaction.provider || 'N/A'}</span>
        </div>
        
        <div class="info-row">
          <span class="label">Amount:</span>
          <span class="value">${formatCurrency(amount)}</span>
        </div>
        
        <div class="info-row">
          <span class="label">Fee:</span>
          <span class="value">${fee > 0 ? formatCurrency(fee) : 'Free'}</span>
        </div>
        
        <div class="total-row">
          <span>Total:</span>
          <span>${formatCurrency(totalAmount)}</span>
        </div>
      </div>
      
      <div class="footer">
        <p>This receipt was generated electronically by Yumvi Pay.</p>
        <p>For any questions, please contact support@yumvipay.com</p>
      </div>
    </body>
    </html>
  `;
};

// Generate a receipt
export const generateReceipt = async (transaction: Transaction): Promise<TransactionReceipt> => {
  // Create HTML content
  const htmlContent = generateHtmlReceipt(transaction);
  
  // Parse transaction values to numbers
  const amount = safeParseNumber(transaction.amount);
  const fee = safeParseNumber(transaction.fee || 0);
  const totalAmount = safeParseNumber(transaction.totalAmount || amount);
  
  // Create receipt object
  const receiptId = `receipt_${transaction.id}`;
  
  // Check if receipt already exists
  const existingReceipt = getReceiptByTransactionId(transaction.id);
  if (existingReceipt) {
    // Update the HTML content but keep the ID
    const updatedReceipt: TransactionReceipt = {
      ...existingReceipt,
      recipientName: transaction.recipientName,
      recipientContact: transaction.recipientContact || '',
      amount: amount,
      fee: fee,
      totalAmount: totalAmount,
      paymentMethod: transaction.paymentMethod || '',
      status: transaction.status,
      htmlContent: htmlContent,
    };
    
    // Store updated receipt
    storeReceipt(updatedReceipt);
    
    return updatedReceipt;
  }
  
  // Create new receipt
  const receipt: TransactionReceipt = {
    id: receiptId,
    transactionId: transaction.id,
    recipientName: transaction.recipientName,
    recipientContact: transaction.recipientContact || '',
    amount: amount,
    fee: fee,
    totalAmount: totalAmount,
    paymentMethod: transaction.paymentMethod || '',
    status: transaction.status,
    generatedAt: new Date(),
    htmlContent: htmlContent,
  };
  
  // Store receipt
  storeReceipt(receipt);
  
  return receipt;
};

// Send a receipt to a recipient via email
export const sendReceiptByEmail = async (
  receipt: TransactionReceipt,
  recipientEmail: string
): Promise<boolean> => {
  if (isOffline()) {
    console.log('Device is offline. Email receipt queued for later.');
    
    // Queue the request for when the device is back online
    addPausedRequest(() => sendReceiptByEmail(receipt, recipientEmail));
    
    toast({
      title: "Receipt Queued",
      description: "Email will be sent when you're back online",
    });
    
    return false;
  }
  
  try {
    // In a real app, this would call a backend API endpoint
    // For now, we'll simulate success
    console.log(`Receipt would be sent to ${recipientEmail}`);
    console.log('Receipt HTML:', receipt.htmlContent?.substring(0, 100) + '...');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    toast({
      title: "Receipt Sent",
      description: `Receipt sent to ${recipientEmail}`,
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send receipt by email:', error);
    
    toast({
      title: "Sending Failed",
      description: "Could not send receipt by email",
      variant: "destructive",
    });
    
    return false;
  }
};

// Download a receipt as HTML
export const downloadReceiptAsHtml = (receipt: TransactionReceipt): void => {
  if (!receipt.htmlContent) {
    toast({
      title: "Error",
      description: "Receipt HTML content not available",
      variant: "destructive",
    });
    return;
  }
  
  // Create a blob with the HTML content
  const blob = new Blob([receipt.htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create a link element and trigger download
  const a = document.createElement('a');
  a.href = url;
  a.download = `receipt_${receipt.transactionId}.html`;
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
  
  toast({
    title: "Receipt Downloaded",
    description: "HTML receipt saved to your device",
  });
};

// Get a receipt by transaction ID
export const getReceiptByTransactionId = (transactionId: string): TransactionReceipt | null => {
  const receipts = getStoredReceipts();
  return receipts.find(r => r.transactionId === transactionId) || null;
};

// Save receipts for offline access
export const saveReceiptsOffline = async (receipts: TransactionReceipt[]): Promise<void> => {
  try {
    localStorage.setItem(RECEIPT_STORAGE_KEY, JSON.stringify(receipts));
    console.log(`${receipts.length} receipts saved for offline access`);
  } catch (error) {
    console.error('Error saving receipts offline:', error);
  }
};

// Print the current receipt
export const printReceipt = (): void => {
  window.print();
};
