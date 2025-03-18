
import React, { useState } from 'react';
import { Receipt, Download, Printer, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types/transaction';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TransactionReceipt from '@/components/transaction/TransactionReceipt';
import { generateReceipt, downloadReceiptAsHtml, sendReceiptByEmail } from '@/services/receipt/receiptService';
import { toast } from '@/hooks/use-toast';

interface AdminReceiptGeneratorProps {
  transaction: Transaction;
}

const AdminReceiptGenerator: React.FC<AdminReceiptGeneratorProps> = ({ transaction }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleGenerateReceipt = async () => {
    setIsLoading(true);
    
    try {
      await generateReceipt(transaction);
      setIsDialogOpen(true);
      toast({
        title: "Receipt Generated",
        description: "Transaction receipt has been generated successfully",
      });
    } catch (error) {
      console.error('Error generating receipt:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate receipt",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const receipt = await generateReceipt(transaction);
      downloadReceiptAsHtml(receipt);
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download receipt",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = async () => {
    if (!transaction.recipientContact) {
      toast({
        title: "Send Failed",
        description: "Recipient email not available",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const receipt = await generateReceipt(transaction);
      await sendReceiptByEmail(receipt, transaction.recipientContact);
      toast({
        title: "Receipt Sent",
        description: `Receipt sent to ${transaction.recipientContact}`,
      });
    } catch (error) {
      console.error('Error sending receipt:', error);
      toast({
        title: "Send Failed",
        description: "Failed to send receipt by email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={handleGenerateReceipt}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <Receipt className="h-4 w-4" />
        {isLoading ? 'Generating...' : 'Generate Receipt'}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Transaction Receipt</DialogTitle>
          </DialogHeader>
          <div className="p-4 print:p-0">
            <TransactionReceipt 
              transaction={transaction}
              onShare={handleSendEmail}
              onDownload={handleDownload}
            />
            
            <div className="mt-6 flex flex-wrap gap-2 print:hidden">
              <Button onClick={handleDownload} variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button onClick={handlePrint} variant="outline" className="flex-1">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button onClick={handleSendEmail} className="flex-1">
                <Send className="mr-2 h-4 w-4" />
                Email Receipt
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminReceiptGenerator;
