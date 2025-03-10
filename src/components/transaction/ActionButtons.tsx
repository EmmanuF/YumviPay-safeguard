
import React from 'react';
import { motion } from 'framer-motion';
import { Share, SendHorizontal, Download, Mail, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  handleShareTransaction: () => void;
  handleSendAgain?: () => void;
  handleResendReceipt?: () => void;
  isResending?: boolean;
  transactionStatus?: 'pending' | 'processing' | 'completed' | 'failed';
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  handleShareTransaction,
  handleSendAgain,
  handleResendReceipt,
  isResending = false,
  transactionStatus = 'completed'
}) => {
  const showSendAgain = transactionStatus === 'completed' || transactionStatus === 'failed';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="space-y-3"
    >
      <Button 
        onClick={handleShareTransaction} 
        variant="outline" 
        className="w-full flex justify-center items-center"
        size="lg"
      >
        <Share className="mr-2 h-4 w-4" />
        Share Receipt
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full flex justify-center items-center"
        size="lg"
      >
        <Download className="mr-2 h-4 w-4" />
        Download PDF
      </Button>
      
      {handleResendReceipt && (
        <Button 
          onClick={handleResendReceipt} 
          variant="outline"
          className="w-full flex justify-center items-center"
          size="lg"
          disabled={isResending}
        >
          {isResending ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Resend Receipt
            </>
          )}
        </Button>
      )}
      
      {showSendAgain && handleSendAgain && (
        <Button 
          onClick={handleSendAgain} 
          className="w-full flex justify-center items-center"
          size="lg"
        >
          <SendHorizontal className="mr-2 h-4 w-4" />
          Send Again
        </Button>
      )}
    </motion.div>
  );
};

export default ActionButtons;
