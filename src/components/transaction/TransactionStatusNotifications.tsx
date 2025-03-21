
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Smartphone, Download } from 'lucide-react';
import { useNetwork } from '@/contexts/NetworkContext';

interface TransactionStatusNotificationsProps {
  onSendEmail: () => void;
  onSendSms: () => void;
  onDownload: () => void;
  sendingNotification: boolean;
  generatingReceipt: boolean;
}

const TransactionStatusNotifications: React.FC<TransactionStatusNotificationsProps> = ({
  onSendEmail,
  onSendSms,
  onDownload,
  sendingNotification,
  generatingReceipt
}) => {
  const { isOffline } = useNetwork();
  
  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-col p-4 bg-gray-50 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium mb-3">Notification Options</h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 flex items-center justify-center"
            onClick={onSendEmail}
            disabled={sendingNotification || isOffline}
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 flex items-center justify-center" 
            onClick={onSendSms}
            disabled={sendingNotification || isOffline}
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Send SMS
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 flex items-center justify-center" 
            onClick={onDownload}
            disabled={generatingReceipt}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
        
        {isOffline && (
          <p className="text-xs text-amber-600 mt-2">
            You are currently offline. Some notification options are unavailable.
          </p>
        )}
      </div>
    </div>
  );
};

export default TransactionStatusNotifications;
