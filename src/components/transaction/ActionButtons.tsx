
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  handleShareTransaction: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ handleShareTransaction }) => {
  const navigate = useNavigate();
  
  const handleGoToHome = () => {
    navigate('/dashboard');
  };

  const handleNewTransaction = () => {
    navigate('/send');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handleShareTransaction}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button 
          className="flex-1"
          onClick={handleNewTransaction}
        >
          New Transaction
        </Button>
      </div>
      
      <Button 
        variant="ghost" 
        className="w-full"
        onClick={handleGoToHome}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
    </div>
  );
};

export default ActionButtons;
