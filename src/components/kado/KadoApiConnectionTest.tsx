
import React, { useState } from 'react';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useKado } from '@/services/kado/useKado';

const KadoApiConnectionTest: React.FC = () => {
  const { isApiConnected, checkApiConnection } = useKado();
  const [isChecking, setIsChecking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(isApiConnected);
  
  const handleCheckConnection = async () => {
    setIsChecking(true);
    try {
      const { connected } = await checkApiConnection();
      setConnectionStatus(connected);
    } catch (error) {
      console.error('Error checking API connection:', error);
      setConnectionStatus(false);
    } finally {
      setIsChecking(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kado API Connection</CardTitle>
        <CardDescription>
          Check if your application can connect to the Kado API
        </CardDescription>
      </CardHeader>
      <CardContent>
        {connectionStatus === null ? (
          <Alert>
            <AlertTitle>Connection status unknown</AlertTitle>
            <AlertDescription>
              Click the button below to check the connection status.
            </AlertDescription>
          </Alert>
        ) : connectionStatus ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle>Connection Successful</AlertTitle>
            <AlertDescription>
              Your application is successfully connected to the Kado API.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-500" />
            <AlertTitle>Connection Failed</AlertTitle>
            <AlertDescription>
              Could not connect to the Kado API. Please check your API keys and try again.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleCheckConnection} 
          disabled={isChecking}
          className="w-full"
        >
          {isChecking ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Checking Connection...
            </>
          ) : (
            'Check API Connection'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default KadoApiConnectionTest;
