
import { Transaction } from '@/types/transaction';
import { formatCurrency } from '@/utils/formatUtils';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Formats transaction data for CSV export
 */
export const prepareTransactionsForCSV = (transactions: Transaction[]): string => {
  // Define CSV headers
  const headers = [
    'Transaction ID', 
    'Date', 
    'Recipient', 
    'Country', 
    'Amount', 
    'Fee', 
    'Total', 
    'Status'
  ].join(',');
  
  // Format each transaction as a CSV row
  const rows = transactions.map(transaction => {
    const date = transaction.createdAt instanceof Date
      ? transaction.createdAt.toISOString()
      : transaction.date || new Date(transaction.createdAt).toISOString();
      
    return [
      transaction.id,
      date,
      transaction.recipientName,
      transaction.recipientCountry || transaction.country,
      transaction.amount,
      transaction.fee || '0.00',
      transaction.totalAmount || transaction.amount,
      transaction.status
    ].map(value => `"${value}"`).join(',');
  });
  
  // Combine headers and rows
  return [headers, ...rows].join('\n');
};

/**
 * Export transactions as a CSV file
 */
export const exportTransactionsToCSV = (transactions: Transaction[], filename = 'transaction-history'): void => {
  const csvContent = prepareTransactionsForCSV(transactions);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Create a download link and trigger it
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export transactions as a PDF file
 */
export const exportTransactionsToPDF = (transactions: Transaction[], filename = 'transaction-history'): void => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Transaction History', 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  
  // Prepare table data
  const tableColumn = ['Date', 'Recipient', 'Country', 'Amount', 'Status'];
  const tableRows = transactions.map(transaction => {
    const date = transaction.createdAt instanceof Date
      ? transaction.createdAt.toLocaleDateString()
      : new Date(transaction.date || transaction.createdAt).toLocaleDateString();
    
    return [
      date,
      transaction.recipientName,
      transaction.recipientCountry || transaction.country,
      formatCurrency(transaction.amount),
      transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)
    ];
  });
  
  // Add the table
  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [75, 0, 130] },
  });
  
  // Save PDF
  doc.save(`${filename}.pdf`);
};

