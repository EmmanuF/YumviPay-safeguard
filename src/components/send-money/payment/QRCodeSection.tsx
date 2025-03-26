
import React from 'react';
import QRCodeOption from './QRCodeOption';
import { toast } from 'sonner';

interface QRCodeSectionProps {
  transactionData: any;
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({ transactionData }) => {
  return (
    <div className="mt-6">
      <QRCodeOption
        transactionData={transactionData}
        onScanComplete={(data) => {
          console.log("QR Code scan completed with data:", data);
          toast.info('QR code scanned successfully', {
            description: 'The recipient details have been filled in'
          });
        }}
      />
    </div>
  );
};

export default QRCodeSection;
