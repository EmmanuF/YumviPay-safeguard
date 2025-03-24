
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ArrowRight, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';
import { useKado } from '@/services/kado/useKado';
import { kadoApiService } from '@/services/kado/kadoApiService';
import { supabase } from '@/integrations/supabase/client';

const KadoConnectionDebugger = () => {
  const { checkApiConnection } = useKado();
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<null | {
    connected: boolean;
    message: string;
    timestamp: string;
    details?: any;
    error?: any;
  }>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [apiKeysInfo, setApiKeysInfo] = useState<{
    publicKey: boolean;
    privateKey: boolean;
    lastChecked: string | null;
  }>({ publicKey: false, privateKey: false, lastChecked: null });

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()} - ${message}`]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  // Check if API keys are configured in Supabase on component mount
  useEffect(() => {
    checkApiKeysConfigured();
  }, []);

  // Check if API keys are configured in Supabase
  const checkApiKeysConfigured = async () => {
    try {
      addLog('Checking if API keys are configured...');
      
      const { data: secretsData, error: secretsError } = await supabase.functions.invoke('kado-api', {
        body: { endpoint: 'check-secrets' }
      });
      
      if (secretsError) {
        addLog(`Error checking API keys: ${secretsError.message}`);
        setApiKeysInfo({ 
          publicKey: false, 
          privateKey: false, 
          lastChecked: new Date().toISOString() 
        });
        return { publicKey: false, privateKey: false };
      }
      
      const publicKeyConfigured = secretsData?.publicKeyConfigured || false;
      const privateKeyConfigured = secretsData?.privateKeyConfigured || false;
      
      addLog(`API keys status - Public key: ${publicKeyConfigured ? 'Configured' : 'Missing'}, Private key: ${privateKeyConfigured ? 'Configured' : 'Missing'}`);
      
      setApiKeysInfo({
        publicKey: publicKeyConfigured,
        privateKey: privateKeyConfigured,
        lastChecked: new Date().toISOString()
      });
      
      return { publicKey: publicKeyConfigured, privateKey: privateKeyConfigured };
    } catch (error) {
      addLog(`Error checking API keys configuration: ${error instanceof Error ? error.message : String(error)}`);
      setApiKeysInfo({ 
        publicKey: false, 
        privateKey: false, 
        lastChecked: new Date().toISOString() 
      });
      return { publicKey: false, privateKey: false };
    }
  };

  const handleCheckConnection = async () => {
    try {
      setIsChecking(true);
      clearLogs();
      addLog('Starting API connection check...');
      
      // Check if API keys are configured
      await checkApiKeysConfigured();
      
      // If keys aren't configured, don't continue with other tests
      if (!apiKeysInfo.publicKey || !apiKeysInfo.privateKey) {
        addLog(`API keys are not properly configured. Cannot proceed with connection test.`);
        setResult({
          connected: false,
          message: 'API keys are not properly configured in Supabase Edge Functions.',
          timestamp: new Date().toISOString(),
          error: { message: 'Missing API keys' }
        });
        return;
      }
      
      // First, try a direct API call to help with debugging
      try {
        addLog('Trying direct POST request to kado-api edge function...');
        
        const { data: directResponse, error: directError } = await supabase.functions.invoke('kado-api', {
          body: { endpoint: 'ping', method: 'GET' }
        });
        
        if (directError) {
          addLog(`Direct API call error: ${directError.message}`);
          throw new Error(`Edge Function returned a non-2xx status code: ${directError.message}`);
        }
        
        addLog(`Direct API response: ${JSON.stringify(directResponse)}`);
      } catch (directCallError) {
        addLog(`Connection check error: ${directCallError instanceof Error ? directCallError.message : String(directCallError)}`);
      }
      
      // Then try the standard way through our service
      try {
        const standardResponse = await kadoApiService.callKadoApi('ping', 'GET');
        addLog(`Standard API response: ${JSON.stringify(standardResponse)}`);
      } catch (standardCallError) {
        addLog(`Standard API call error: ${standardCallError instanceof Error ? standardCallError.message : String(standardCallError)}`);
      }
      
      // Finally use the higher-level function from the hook
      const result = await checkApiConnection();
      addLog(`Connection check result: ${JSON.stringify(result)}`);
      
      setResult({
        ...result,
        timestamp: new Date().toISOString()
      });
      
      addLog(`Connection check completed: ${result.connected ? 'SUCCESS' : 'FAILED'}`);
    } catch (error) {
      console.error('Error in connection check:', error);
      addLog(`Connection check error: ${error instanceof Error ? error.message : String(error)}`);
      
      setResult({
        connected: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
        error: error
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Kado API Connection Debugger
          {result && (
            <Badge variant={result.connected ? "success" : "destructive"}>
              {result.connected ? 'Connected' : 'Disconnected'}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Test and debug the connection to the Kado API via Supabase Edge Functions
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!apiKeysInfo.publicKey || !apiKeysInfo.privateKey ? (
          <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>API Keys Not Configured</AlertTitle>
            <AlertDescription>
              {!apiKeysInfo.publicKey && !apiKeysInfo.privateKey 
                ? "Both Kado API public and private keys are missing. Please add them to the Supabase Edge Function secrets."
                : !apiKeysInfo.publicKey 
                  ? "Kado API public key is missing. Please add it to the Supabase Edge Function secrets."
                  : "Kado API private key is missing. Please add it to the Supabase Edge Function secrets."
              }
            </AlertDescription>
            <div className="mt-2">
              <a 
                href="https://supabase.com/dashboard/project/bccjymakoczdswgflctv/settings/functions" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-amber-800 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-200"
              >
                Go to Supabase Edge Function Secrets
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </Alert>
        ) : null}
        
        {result && (
          <Alert variant={result.connected ? "default" : "destructive"}>
            <div className="flex items-start gap-2">
              {result.connected ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              <div>
                <AlertTitle>{result.connected ? 'Connection Successful' : 'Connection Failed'}</AlertTitle>
                <AlertDescription>{result.message}</AlertDescription>
                <div className="text-xs mt-1 text-muted-foreground">
                  {result.timestamp}
                </div>
              </div>
            </div>
          </Alert>
        )}
        
        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted px-4 py-2 text-sm font-medium flex justify-between items-center">
            <span>Connection Logs</span>
            <Button variant="ghost" size="sm" onClick={clearLogs}>Clear</Button>
          </div>
          <div className="p-4 max-h-60 overflow-y-auto bg-muted/30 text-sm font-mono">
            {logs.length > 0 ? (
              logs.map((log, i) => (
                <div key={i} className="py-0.5 border-b border-dashed border-muted last:border-0">
                  {log}
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4">No logs yet. Click "Check Connection" to start.</div>
            )}
          </div>
        </div>
        
        {result?.details && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-medium mb-2">Raw Response Details</h3>
              <pre className="text-xs bg-muted/30 p-3 rounded overflow-x-auto">
                {JSON.stringify(result.details, null, 2)}
              </pre>
            </div>
          </>
        )}
        
        {result?.error && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-medium mb-2 text-destructive">Error Details</h3>
              <pre className="text-xs bg-destructive/10 text-destructive p-3 rounded overflow-x-auto">
                {JSON.stringify(result.error, null, 2)}
              </pre>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2">
        <Button 
          onClick={handleCheckConnection} 
          disabled={isChecking}
          className="gap-2"
        >
          {isChecking ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          {isChecking ? 'Checking Connection...' : 'Check Connection'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={checkApiKeysConfigured}
          disabled={isChecking}
          size="sm"
          className="ml-auto"
        >
          Refresh API Key Status
        </Button>
      </CardFooter>
    </Card>
  );
};

export default KadoConnectionDebugger;
