import React, { useState } from 'react';
import { Check, X, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { updateTransactionStatus } from '@/services/transaction';
import { toast } from '@/hooks/use-toast';

interface KadoWebhookSimulatorProps {
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
  
  const failureReasons = [
    { value: 'payment_failed', label: 'Payment failed' },
    { value: 'insufficient_funds', label: 'Insufficient funds' },
    { value: 'kyc_rejected', label: 'KYC verification rejected' },
    { value: 'suspicious_activity', label: 'Suspicious activity detected' },
    { value: 'invalid_recipient', label: 'Invalid recipient information' },
  ];
  
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      let failureReason;
      
      if (status === 'failed') {
        failureReason = failureReasons.find(r => r.value === reason)?.label || 'Transaction failed';
      }
      
      const updatedTransaction = updateTransactionStatus(transactionId, status, failureReason);
      
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
          <div>
            <Label>Transaction Status</Label>
            <RadioGroup
              value={status}
              onValueChange={(value) => setStatus(value as 'completed' | 'failed')}
              className="flex flex-col space-y-2 mt-2"
            >
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="completed" id="completed" className="mt-1" />
                <div className="grid gap-1">
                  <Label htmlFor="completed" className="font-medium flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    Completed
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Transaction was successful and funds were sent
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="failed" id="failed" className="mt-1" />
                <div className="grid gap-1">
                  <Label htmlFor="failed" className="font-medium flex items-center">
                    <X className="h-4 w-4 mr-2 text-red-500" />
                    Failed
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Transaction failed and no funds were sent
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          {status === 'failed' && (
            <div>
              <Label htmlFor="reason">Failure Reason</Label>
              <Select
                value={reason}
                onValueChange={setReason}
              >
                <SelectTrigger id="reason" className="mt-1">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {failureReasons.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <Switch 
                id="advanced" 
                checked={showAdvanced} 
                onCheckedChange={setShowAdvanced}
              />
              <Label htmlFor="advanced">Show advanced options</Label>
            </div>
          </div>
          
          {showAdvanced && (
            <div className="space-y-4 mt-4 p-4 bg-muted rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-1" />
                <p className="text-sm text-muted-foreground">
                  Advanced options are for testing purposes only and may affect transaction processing.
                </p>
              </div>
              
              <div>
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  value="https://api.yumvi-pay.com/webhooks/kado"
                  readOnly
                  className="mt-1 font-mono text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="delay">Simulated Response Delay (ms)</Label>
                <Input
                  id="delay"
                  type="number"
                  defaultValue="1000"
                  min="0"
                  max="10000"
                  className="mt-1"
                />
              </div>
            </div>
          )}
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
