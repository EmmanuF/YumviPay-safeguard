
import React, { useState, useEffect } from 'react';
import { useInterval } from '@/hooks/useInterval';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

type ApiKeyStatus = {
  publicKey: boolean;
  privateKey: boolean;
  lastChecked: string | null;
};

const KadoApiStatusMonitor = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [apiKeysInfo, setApiKeysInfo] = useState<ApiKeyStatus>({
    publicKey: false,
    privateKey: false,
    lastChecked: null
  });
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  const checkApiKeysConfigured = async () => {
    try {
      setIsLoading(true);
      console.log('Checking if API keys are configured...');
      
      const { data: secretsData, error: secretsError } = await supabase.functions.invoke('kado-api', {
        body: { endpoint: 'check-secrets' }
      });
      
      if (secretsError) {
        console.error('Error checking API keys:', secretsError);
        setApiKeysInfo({ 
          publicKey: false, 
          privateKey: false, 
          lastChecked: new Date().toISOString() 
        });
        return { publicKey: false, privateKey: false };
      }
      
      const publicKeyConfigured = secretsData?.publicKeyConfigured || false;
      const privateKeyConfigured = secretsData?.privateKeyConfigured || false;
      
      console.log(`API keys status - Public key: ${publicKeyConfigured ? 'Configured' : 'Missing'}, Private key: ${privateKeyConfigured ? 'Configured' : 'Missing'}`);
      
      setApiKeysInfo({
        publicKey: publicKeyConfigured,
        privateKey: privateKeyConfigured,
        lastChecked: new Date().toISOString()
      });
      
      return { publicKey: publicKeyConfigured, privateKey: privateKeyConfigured };
    } catch (error) {
      console.error(`Error checking API keys configuration:`, error);
      setApiKeysInfo({ 
        publicKey: false, 
        privateKey: false, 
        lastChecked: new Date().toISOString() 
      });
      return { publicKey: false, privateKey: false };
    } finally {
      setIsLoading(false);
    }
  };

  // Initial check
  useEffect(() => {
    checkApiKeysConfigured();
  }, []);

  // Setup auto-refresh
  useInterval(() => {
    if (autoRefresh) {
      checkApiKeysConfigured();
    }
  }, refreshInterval);

  const formatTime = (isoString: string | null) => {
    if (!isoString) return 'Never';
    
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString();
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getStatusBadge = () => {
    if (isLoading) {
      return <Badge variant="outline" className="animate-pulse">Checking...</Badge>;
    }
    
    if (apiKeysInfo.publicKey && apiKeysInfo.privateKey) {
      return <Badge variant="success">Both Keys Configured</Badge>;
    }
    
    if (!apiKeysInfo.publicKey && !apiKeysInfo.privateKey) {
      return <Badge variant="destructive">No Keys Configured</Badge>;
    }
    
    return <Badge variant="warning">Partially Configured</Badge>;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Kado API Keys Status</span>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : (
          <div className="space-y-3">
            {(!apiKeysInfo.publicKey || !apiKeysInfo.privateKey) ? (
              <Alert variant="warning" className="bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Missing API Keys</AlertTitle>
                <AlertDescription>
                  {!apiKeysInfo.publicKey && !apiKeysInfo.privateKey 
                    ? "Both Kado API public and private keys are missing."
                    : !apiKeysInfo.publicKey 
                      ? "Kado API public key is missing."
                      : "Kado API private key is missing."
                  }
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="text-muted-foreground">Public Key</div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" /> 
                  Configured
                </div>
                
                <div className="text-muted-foreground">Private Key</div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" /> 
                  Configured
                </div>
              </div>
            )}
            
            <div className="text-xs text-muted-foreground mt-2">
              Last checked: {formatTime(apiKeysInfo.lastChecked)}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => checkApiKeysConfigured()} 
          disabled={isLoading}
          className="gap-1"
        >
          {isLoading && <RefreshCw className="h-3 w-3 animate-spin" />}
          {!isLoading && <RefreshCw className="h-3 w-3" />}
          Refresh
        </Button>
        
        <Button
          variant={autoRefresh ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setAutoRefresh(!autoRefresh)}
          className="text-xs"
        >
          {autoRefresh ? "Auto-refresh: On" : "Auto-refresh: Off"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default KadoApiStatusMonitor;
