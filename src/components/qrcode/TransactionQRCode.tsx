
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { QrCode, Scan } from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';
import QRCodeScanner from './QRCodeScanner';
import { useQRCode } from '@/hooks/useQRCode';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface TransactionQRCodeProps {
  transactionData: any;
  onScanComplete?: (data: any) => void;
}

const TransactionQRCode: React.FC<TransactionQRCodeProps> = ({
  transactionData,
  onScanComplete
}) => {
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const { toast } = useToast();
  const { 
    isScanning, 
    setIsScanning, 
    handleScanSuccess, 
    generateTransactionQR,
    parseTransactionQR 
  } = useQRCode({
    onScan: (data) => {
      const parsedData = parseTransactionQR(data);
      if (parsedData && onScanComplete) {
        onScanComplete(parsedData);
      }
    },
    validateQrData: (data) => {
      try {
        const parsed = JSON.parse(data);
        return parsed.type === 'yumvi-pay-transaction' && !!parsed.id;
      } catch {
        return false;
      }
    }
  });

  const handleQRGenerate = () => {
    setShowQRGenerator(true);
  };

  const handleScan = () => {
    setIsScanning(true);
  };

  const handleScanResult = (result: string) => {
    handleScanSuccess(result);
  };

  const qrCodeData = generateTransactionQR(transactionData);
  
  const transactionAmount = transactionData.amount ? 
    `${transactionData.amount} ${transactionData.targetCurrency || ''}` : 
    'Scan for details';

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-3">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleQRGenerate}
          >
            <QrCode className="h-4 w-4 mr-2" />
            Generate QR
          </Button>
          
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleScan}
          >
            <Scan className="h-4 w-4 mr-2" />
            Scan QR
          </Button>
        </div>
        
        <AnimatePresence>
          {showQRGenerator && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <QRCodeGenerator
                  data={qrCodeData}
                  title="Transaction QR Code"
                  description={`Amount: ${transactionAmount}`}
                />
                
                <div className="mt-3 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowQRGenerator(false)}
                  >
                    Hide QR Code
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* QR Code Scanner Modal */}
      <QRCodeScanner
        isOpen={isScanning}
        onScanSuccess={handleScanResult}
        onClose={() => setIsScanning(false)}
      />
    </div>
  );
};

export default TransactionQRCode;
