
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { updateTransactionStatus } from '@/services/transaction';
import { toast } from '@/hooks/use-toast';
import StatusSelector from './StatusSelector';
import FailureReasonSelector from './FailureReasonSelector';
import AdvancedOptions from './AdvancedOptions';

export interface KadoWebhookSimulatorProps {
  transactionId: string;
  onSuccess?: () => void;
  onFailure?: () => void;
}

const KadoWebhookSimulator: React.FC<KadoWebhookSimulatorProps> = ({
  transactionId,
  onSuccess,
  onFailure
}) => {
  const [status, setStatus] = useState<'completed' | 'failed'>('completed');
  const [reason, setReason] = useState('payment_failed');
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      let failureReason;
      
      if (status === 'failed') {
        const failureReasons = [
          { value: 'payment_failed', label: 'Payment failed' },
          { value: 'insufficient_funds', label: 'Insufficient funds' },
          { value: 'kyc_rejected', label: 'KYC verification rejected' },
          { value: 'suspicious_activity', label: 'Suspicious activity detected' },
          { value: 'invalid_recipient', label: 'Invalid recipient information' },
        ];
        
        failureReason = failureReasons.find(r => r.value === reason)?.label || 'Transaction failed';
      }
      
      const updatedTransaction = await updateTransactionStatus(transactionId, status, {
        failureReason: status === 'failed' ? failureReason : undefined,
        completedAt: status === 'completed' ? new Date() : undefined
      });
      
      if (updatedTransaction) {
        toast({
          title: status === 'completed' ? "Webhook successful" : "Webhook failed",
          description: status === 'completed' 
            ? "Transaction marked as completed" 
            : `Transaction marked as failed: ${failureReason}`
        });
        
        if (status === 'completed' && onSuccess) {
          onSuccess();
        } else if (status === 'failed' && onFailure) {
          onFailure();
        }
      } else {
        toast({
          title: "Error",
          description: "Transaction not found",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error simulating webhook:', error);
      toast({
        title: "Error",
        description: "Failed to simulate webhook",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kado Webhook Simulator</CardTitle>
        <CardDescription>
          Simulate a webhook response from Kado for testing purposes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <StatusSelector 
            value={status} 
            onChange={(value) => setStatus(value as 'completed' | 'failed')} 
          />
          
          {status === 'failed' && (
            <FailureReasonSelector
              value={reason}
              onChange={setReason}
            />
          )}
          
          <AdvancedOptions
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Simulating...
            </>
          ) : (
            'Simulate Webhook Response'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default KadoWebhookSimulator;
