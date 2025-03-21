
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

interface QuickSendProps {
  className?: string;
}

const QuickSend: React.FC<QuickSendProps> = ({ className }) => {
  const navigate = useNavigate();
  
  // Placeholder recipients for demonstration
  const recipients = [
    { id: 1, name: 'Sarah Johnson', avatar: '' },
    { id: 2, name: 'Michael Chen', avatar: '' },
    { id: 3, name: 'Amina Diallo', avatar: '' },
  ];
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Quick Send</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 overflow-x-auto py-2">
          {recipients.map((recipient) => (
            <div 
              key={recipient.id} 
              className="flex flex-col items-center space-y-1 cursor-pointer"
              onClick={() => navigate(`/transaction/new?recipient=${recipient.id}`)}
            >
              <Avatar className="h-12 w-12">
                <div className="bg-primary/20 text-primary w-full h-full flex items-center justify-center">
                  {recipient.name.charAt(0)}
                </div>
              </Avatar>
              <span className="text-xs text-center whitespace-nowrap">{recipient.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickSend;
