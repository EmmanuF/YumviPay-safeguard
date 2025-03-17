
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { usePinManagement } from '@/services/security/transactionPin';
import { Lock, AlertCircle } from 'lucide-react';

interface TransactionPinDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

const TransactionPinDialog: React.FC<TransactionPinDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Enter Transaction PIN',
  description = 'Please enter your 4-digit transaction PIN to authorize this action.'
}) => {
  const [pin, setPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Use our new custom hook
  const { 
    pinStatus, 
    verifyPin, 
    refreshPinStatus,
  } = usePinManagement();
  
  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(null);
      refreshPinStatus();
    }
  }, [isOpen, refreshPinStatus]);
  
  useEffect(() => {
    if (pinStatus.isLocked && pinStatus.lockoutTimeRemaining) {
      const minutes = Math.ceil(pinStatus.lockoutTimeRemaining / 60000);
      setError(`Too many failed attempts. Try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`);
    }
  }, [pinStatus]);
  
  const handleVerifyPin = async () => {
    if (pin.length !== 4) {
      return;
    }
    
    setIsVerifying(true);
    setError(null);
    
    try {
      const isValid = await verifyPin(pin);
      
      if (isValid) {
        toast({
          title: 'PIN verified',
          description: 'Transaction authorized successfully',
        });
        onSuccess();
        onClose();
      } else {
        // Error message will be set based on the updated pinStatus
        if (pinStatus.isLocked) {
          const minutes = Math.ceil(pinStatus.lockoutTimeRemaining! / 60000);
          setError(`Too many failed attempts. Try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`);
        } else {
          setError(`Incorrect PIN. ${pinStatus.remainingAttempts} attempt${pinStatus.remainingAttempts !== 1 ? 's' : ''} remaining.`);
        }
        setPin('');
      }
    } catch (err) {
      console.error('Error verifying PIN:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
          <InputOTP 
            maxLength={4} 
            value={pin} 
            onChange={setPin}
            onComplete={handleVerifyPin}
            disabled={isVerifying || (pinStatus?.isLocked || false)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
          
          {error && (
            <div className="flex items-center gap-2 mt-4 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleVerifyPin} 
            disabled={pin.length !== 4 || isVerifying || (pinStatus?.isLocked || false)}
          >
            {isVerifying ? 'Verifying...' : 'Verify'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionPinDialog;
