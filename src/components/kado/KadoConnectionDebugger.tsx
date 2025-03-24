
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ArrowRight, RefreshCw } from 'lucide-react';
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

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()} - ${message}`]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const handleCheckConnection = async () => {
    try {
      setIsChecking(true);
      addLog('Starting API connection check...');
      
      // First, try a direct API call to help with debugging
      try {
        addLog('Trying direct GET request to kado-api edge function...');
        
        const { data: directResponse, error: directError } = await supabase.functions.invoke('kado-api', {
          method: 'GET',
          queryParams: { endpoint: 'ping' }
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
      
      <CardFooter>
        <Button 
          onClick={handleCheckConnection} 
          disabled={isChecking}
          className="gap-2"
        >
          {isChecking ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          {isChecking ? 'Checking Connection...' : 'Check Connection'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default KadoConnectionDebugger;
