
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface CloseAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

const CloseAccountDialog: React.FC<CloseAccountDialogProps> = ({
  open,
  onOpenChange,
  onConfirm
}) => {
  const [confirmation, setConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleConfirm = async () => {
    if (confirmation.toLowerCase() !== 'close my account') {
      toast({
        title: "Incorrect confirmation",
        description: "Please type 'close my account' to confirm.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onConfirm();
      toast({
        title: "Account closure request submitted",
        description: "We've received your request to close your account. Our team will process it within 30 days.",
        variant: "default",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error closing account:', error);
      toast({
        title: "Failed to submit request",
        description: "There was an error processing your request. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">Close Your Account</AlertDialogTitle>
          <AlertDialogDescription>
            <p className="mb-4">
              This action will initiate the process to permanently close your Yumvi-Pay account. Our support team will review your request and process it within 30 days.
            </p>
            <p className="mb-4">
              Before proceeding, please ensure you don't have any pending transactions. All your personal data will be deleted according to our data retention policy.
            </p>
            <p className="mb-4 font-medium">
              This action cannot be undone. Type "close my account" to confirm.
            </p>
            <Input 
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="close my account"
              className="mb-2"
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            disabled={isSubmitting || confirmation.toLowerCase() !== 'close my account'}
          >
            {isSubmitting ? "Processing..." : "Close Account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CloseAccountDialog;
