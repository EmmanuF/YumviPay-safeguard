
import React, { useState } from 'react';
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
import { AlertCircle, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBiometricProtection } from '@/hooks/useBiometricProtection';

// This would be connected to your user settings in a real app
const DEFAULT_TRANSACTION_LIMITS = {
  daily: 1000,
  singleTransaction: 500
};

const TransactionLimits: React.FC = () => {
  const [limits, setLimits] = useState(DEFAULT_TRANSACTION_LIMITS);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [dailyLimit, setDailyLimit] = useState(limits.daily.toString());
  const [singleLimit, setSingleLimit] = useState(limits.singleTransaction.toString());
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { toast } = useToast();
  const { protectOperation } = useBiometricProtection({
    promptMessage: 'Verify your identity to change transaction limits'
  });
  
  const handleSaveChanges = async () => {
    setError(null);
    
    const newDailyLimit = parseFloat(dailyLimit);
    const newSingleLimit = parseFloat(singleLimit);
    
    if (isNaN(newDailyLimit) || isNaN(newSingleLimit)) {
      setError('Please enter valid numbers');
      return;
    }
    
    if (newDailyLimit < newSingleLimit) {
      setError('Daily limit must be greater than or equal to the single transaction limit');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // This would be an API call in a real app
      await protectOperation(async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setLimits({
          daily: newDailyLimit,
          singleTransaction: newSingleLimit
        });
        
        setShowEditDialog(false);
        toast({
          title: 'Limits Updated',
          description: 'Your transaction limits have been updated successfully',
        });
      });
    } catch (err) {
      setError('Failed to update transaction limits');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <DollarSign className="w-5 h-5 mr-2" />
          Transaction Limits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Daily Transaction Limit</h3>
              <p className="text-sm text-muted-foreground">
                Maximum amount you can transfer in 24 hours
              </p>
            </div>
            <div className="flex items-center">
              <Badge variant="outline" className="mr-3">
                ${limits.daily.toLocaleString()}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Single Transaction Limit</h3>
              <p className="text-sm text-muted-foreground">
                Maximum amount per transaction
              </p>
            </div>
            <div className="flex items-center">
              <Badge variant="outline" className="mr-3">
                ${limits.singleTransaction.toLocaleString()}
              </Badge>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => {
                setDailyLimit(limits.daily.toString());
                setSingleLimit(limits.singleTransaction.toString());
                setShowEditDialog(true);
              }}
            >
              Edit Limits
            </Button>
          </div>
        </div>
      </CardContent>
      
      {/* Edit Limits Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Transaction Limits</DialogTitle>
            <DialogDescription>
              Set daily and per-transaction limits for your account
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Daily Transaction Limit</label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Enter daily limit"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Single Transaction Limit</label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Enter single transaction limit"
                  value={singleLimit}
                  onChange={(e) => setSingleLimit(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            {error && (
              <div className="text-destructive text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveChanges} 
              disabled={isProcessing}
            >
              {isProcessing ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TransactionLimits;
