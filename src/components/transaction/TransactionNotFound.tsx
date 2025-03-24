
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileX, Home, RefreshCw } from 'lucide-react';

interface TransactionNotFoundProps {
  onRetry?: () => void;
}

const TransactionNotFound: React.FC<TransactionNotFoundProps> = ({ onRetry }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="flex-1 p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <FileX className="h-5 w-5 mr-2 text-amber-500" />
            Transaction Not Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-muted p-6 rounded-full">
              <FileX className="h-12 w-12 text-muted-foreground" />
            </div>
            
            <p className="text-center text-muted-foreground">
              We couldn't find the transaction you're looking for. It may have been deleted or the ID is incorrect.
            </p>
            
            <div className="flex flex-col w-full space-y-2">
              {onRetry && (
                <Button variant="outline" className="w-full" onClick={onRetry}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              )}
              
              <Button className="w-full" onClick={handleGoHome}>
                <Home className="h-4 w-4 mr-2" />
                Go to Home
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionNotFound;
