
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, History, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HomeActionsProps {
  className?: string;
}

const HomeActions: React.FC<HomeActionsProps> = ({ className }) => {
  const navigate = useNavigate();
  
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-3">
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center space-y-2"
            onClick={() => navigate('/send')}
          >
            <Send className="h-5 w-5" />
            <span className="text-xs">Send Money</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center space-y-2"
            onClick={() => navigate('/transactions')}
          >
            <History className="h-5 w-5" />
            <span className="text-xs">Transactions</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 items-center justify-center space-y-2"
            onClick={() => navigate('/profile')}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeActions;
