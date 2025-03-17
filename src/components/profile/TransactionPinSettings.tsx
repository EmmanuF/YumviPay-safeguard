
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Lock, Shield, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePinManagement } from '@/services/security/transactionPin';
import { useBiometricProtection } from '@/hooks/useBiometricProtection';

const TransactionPinSettings: React.FC = () => {
  const { 
    pinStatus, 
    setPin, 
    changePin, 
    removePin, 
    refreshPinStatus 
  } = usePinManagement();
  
  const [showSetPinDialog, setShowSetPinDialog] = useState(false);
  const [showChangePinDialog, setShowChangePinDialog] = useState(false);
  const [showRemovePinDialog, setShowRemovePinDialog] = useState(false);
  const [pin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPinStrong, setIsPinStrong] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { toast } = useToast();
  const { protectOperation } = useBiometricProtection({
    promptMessage: 'Verify your identity to manage transaction PIN'
  });
  
  // Reset dialog state when closed
  useEffect(() => {
    if (!showSetPinDialog && !showChangePinDialog && !showRemovePinDialog) {
      setNewPin('');
      setConfirmPin('');
      setCurrentPin('');
      setError(null);
    }
  }, [showSetPinDialog, showChangePinDialog, showRemovePinDialog]);
  
  // Check PIN strength
  useEffect(() => {
    // Simple PIN strength check - consider more robust validation in production
    setIsPinStrong(pin.length === 4 && !/(\d)\1{3}/.test(pin) && pin !== '1234' && pin !== '0000');
  }, [pin]);
  
  // Load PIN status on component mount
  useEffect(() => {
    refreshPinStatus();
  }, [refreshPinStatus]);
  
  const handleCreatePin = async () => {
    setError(null);
    
    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }
    
    if (!isPinStrong) {
      setError('Please choose a stronger PIN');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const success = await setPin(pin);
      
      if (success) {
        setShowSetPinDialog(false);
        toast({
          title: 'PIN Created',
          description: 'Your transaction PIN has been set successfully',
        });
        await refreshPinStatus();
      } else {
        setError('Failed to set PIN');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleChangePin = async () => {
    setError(null);
    
    if (pin !== confirmPin) {
      setError('New PINs do not match');
      return;
    }
    
    if (!isPinStrong) {
      setError('Please choose a stronger PIN');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const success = await changePin(currentPin, pin);
      
      if (success) {
        setShowChangePinDialog(false);
        toast({
          title: 'PIN Changed',
          description: 'Your transaction PIN has been changed successfully',
        });
        await refreshPinStatus();
      } else {
        setError('Incorrect current PIN or failed to change PIN');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleRemovePin = async () => {
    setError(null);
    setIsProcessing(true);
    
    try {
      // Protect this operation with biometrics if available
      const result = await protectOperation(async () => {
        const success = await removePin();
        
        if (success) {
          setShowRemovePinDialog(false);
          toast({
            title: 'PIN Removed',
            description: 'Your transaction PIN has been removed successfully',
          });
          await refreshPinStatus();
        } else {
          setError('Failed to remove PIN');
        }
      });
      
      if (!result) {
        setError('Biometric verification failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Lock className="w-5 h-5 mr-2" />
          Transaction PIN Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Transaction PIN</h3>
              <p className="text-sm text-muted-foreground">
                Secure sensitive transactions with a PIN
              </p>
            </div>
            <div className="flex items-center">
              {pinStatus?.isSet ? (
                <Badge variant="outline" className="mr-3 bg-green-50">
                  Enabled
                </Badge>
              ) : (
                <Badge variant="outline" className="mr-3 bg-red-50">
                  Not Set
                </Badge>
              )}
              {pinStatus?.isSet ? (
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowChangePinDialog(true)}
                  >
                    Change
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowRemovePinDialog(true)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <Button 
                  size="sm"
                  onClick={() => setShowSetPinDialog(true)}
                >
                  Set PIN
                </Button>
              )}
            </div>
          </div>
          
          {pinStatus?.isLocked && (
            <div className="flex items-center p-3 bg-destructive/10 rounded-md text-sm">
              <AlertCircle className="h-4 w-4 mr-2 text-destructive" />
              <span>
                PIN locked due to too many failed attempts. 
                {pinStatus.lockoutTimeRemaining && (
                  ` Try again in ${Math.ceil(pinStatus.lockoutTimeRemaining / 60000)} minutes.`
                )}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Set PIN Dialog */}
      <Dialog open={showSetPinDialog} onOpenChange={setShowSetPinDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Transaction PIN</DialogTitle>
            <DialogDescription>
              Create a 4-digit PIN to protect sensitive transactions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter PIN</label>
              <Input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                placeholder="Enter 4-digit PIN"
                value={pin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm PIN</label>
              <Input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                placeholder="Confirm 4-digit PIN"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              />
            </div>
            
            {error && (
              <div className="text-destructive text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSetPinDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePin} 
              disabled={pin.length !== 4 || confirmPin.length !== 4 || isProcessing}
            >
              {isProcessing ? 'Creating...' : 'Create PIN'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Change PIN Dialog */}
      <Dialog open={showChangePinDialog} onOpenChange={setShowChangePinDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Transaction PIN</DialogTitle>
            <DialogDescription>
              Enter your current PIN and create a new one
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current PIN</label>
              <Input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                placeholder="Enter current PIN"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New PIN</label>
              <Input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                placeholder="Enter new PIN"
                value={pin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm New PIN</label>
              <Input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                placeholder="Confirm new PIN"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              />
            </div>
            
            {error && (
              <div className="text-destructive text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangePinDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleChangePin} 
              disabled={currentPin.length !== 4 || pin.length !== 4 || confirmPin.length !== 4 || isProcessing}
            >
              {isProcessing ? 'Changing...' : 'Change PIN'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Remove PIN Dialog */}
      <Dialog open={showRemovePinDialog} onOpenChange={setShowRemovePinDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Transaction PIN</DialogTitle>
            <DialogDescription>
              This will remove your transaction PIN. Sensitive operations will no longer require PIN verification.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center p-3 bg-yellow-50 rounded-md text-sm mb-4">
              <Shield className="h-4 w-4 mr-2 text-yellow-600" />
              <span className="text-yellow-800">
                Warning: Removing your PIN reduces the security of your account.
              </span>
            </div>
            
            {error && (
              <div className="text-destructive text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRemovePinDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleRemovePin} 
              disabled={isProcessing}
            >
              {isProcessing ? 'Removing...' : 'Remove PIN'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TransactionPinSettings;
