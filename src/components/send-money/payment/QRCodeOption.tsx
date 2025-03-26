
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode } from 'lucide-react';
import TransactionQRCode from '@/components/qrcode/TransactionQRCode';

interface QRCodeOptionProps {
  transactionData: any;
  onSelect?: () => void;
  isSelected?: boolean;
  onScanComplete?: (data: any) => void;
}

const QRCodeOption: React.FC<QRCodeOptionProps> = ({
  transactionData,
  onSelect,
  isSelected = false,
  onScanComplete
}) => {
  return (
    <Card className={`w-full ${isSelected ? 'ring-2 ring-primary' : ''}`} onClick={onSelect}>
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          <QrCode className="h-5 w-5 text-primary-600 mr-2" />
          <h3 className="text-lg font-medium">QR Code Options</h3>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          Generate a QR code for this transaction or scan an existing code to quickly fill in recipient details.
        </p>
        
        <TransactionQRCode 
          transactionData={transactionData}
          onScanComplete={onScanComplete}
        />
      </CardContent>
    </Card>
  );
};

export default QRCodeOption;
