
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import CloseAccountDialog from './CloseAccountDialog';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

const AccountDeletion: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const handleAccountClosure = async () => {
    // In a real implementation, this would make an API call to initiate the account closure process
    // For now, we'll just simulate it with a success message and sign out
    
    try {
      // Send email to support (would be handled by an API in real implementation)
      console.log('Sending account closure request email');
      
      // Sign out the user after requesting account closure
      await signOut();
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Error in account closure process:', error);
      throw error;
    }
  };
  
  return (
    <Card className="border-destructive/30 mt-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Close Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Closing your account will permanently delete all your data and cannot be undone.
          Please contact our support team if you have any questions before proceeding.
        </p>
        <Button 
          variant="outline" 
          className="border-destructive text-destructive hover:bg-destructive/10"
          onClick={() => setDialogOpen(true)}
        >
          Request Account Closure
        </Button>
        
        <CloseAccountDialog 
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onConfirm={handleAccountClosure}
        />
      </CardContent>
    </Card>
  );
};

export default AccountDeletion;
