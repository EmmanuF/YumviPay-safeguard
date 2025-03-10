
import React from 'react';
import { motion } from 'framer-motion';
import { Share, SendHorizontal, Download, Mail, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  handleShareTransaction: () => void;
  handleSendAgain?: () => void;
  handleResendReceipt?: () => void;
  isResending?: boolean;
  transactionStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  isOnline?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  handleShareTransaction,
  handleSendAgain,
  handleResendReceipt,
  isResending = false,
  transactionStatus = 'completed',
  isOnline = true
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
        disabled={!isOnline && !navigator.share}
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
          disabled={isResending || !isOnline}
        >
          {isResending ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : !isOnline ? (
            <>
              <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
              Offline - Cannot Send
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
          disabled={!isOnline}
        >
          {!isOnline ? (
            <>
              <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
              Offline - Cannot Send Again
            </>
          ) : (
            <>
              <SendHorizontal className="mr-2 h-4 w-4" />
              Send Again
            </>
          )}
        </Button>
      )}
    </motion.div>
  );
};

export default ActionButtons;
