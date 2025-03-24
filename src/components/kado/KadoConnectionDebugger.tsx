
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ArrowRight, RefreshCw, AlertTriangle, ExternalLink, Wrench, Bug } from 'lucide-react';
import { useKado } from '@/services/kado/useKado';
import { kadoApiService } from '@/services/kado/kadoApiService';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [diagnosticData, setDiagnosticData] = useState<any>(null);
  const [apiKeysInfo, setApiKeysInfo] = useState<{
    publicKey: boolean;
    privateKey: boolean;
    lastChecked: string | null;
  }>({ publicKey: false, privateKey: false, lastChecked: null });
  const [activeTab, setActiveTab] = useState('basic');

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

  const runDiagnostics = async () => {
    try {
      setIsChecking(true);
      addLog('Running advanced diagnostics...');
      
      const { data, error } = await supabase.functions.invoke('kado-api', {
        body: { endpoint: 'diagnostics' }
      });
      
      if (error) {
        addLog(`Diagnostics error: ${error.message}`);
        throw error;
      }
      
      setDiagnosticData(data);
      addLog('Diagnostics completed successfully');
      
      // Update API keys info based on diagnostic data
      if (data?.apiKeys) {
        setApiKeysInfo({
          publicKey: data.apiKeys.publicKeyConfigured,
          privateKey: data.apiKeys.privateKeyConfigured,
          lastChecked: new Date().toISOString()
        });
      }
      
      return data;
    } catch (error) {
      addLog(`Error running diagnostics: ${error instanceof Error ? error.message : String(error)}`);
      console.error('Diagnostics error:', error);
      return null;
    } finally {
      setIsChecking(false);
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="basic">Basic Check</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Diagnostics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <Alert variant="info" className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300">
              <Wrench className="h-5 w-5" />
              <AlertTitle>Advanced Diagnostics</AlertTitle>
              <AlertDescription>
                This will run a series of tests to diagnose connectivity issues with the Kado API,
                including environment checks, HMAC signature verification, and network connectivity tests.
              </AlertDescription>
            </Alert>
            
            {diagnosticData && (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      Environment
                      <Badge variant="outline" className="text-xs">
                        Deno {diagnosticData.environment?.denoVersion}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Deno Version</div>
                      <div>{diagnosticData.environment?.denoVersion}</div>
                      <div className="text-muted-foreground">V8 Version</div>
                      <div>{diagnosticData.environment?.v8Version}</div>
                      <div className="text-muted-foreground">TypeScript Version</div>
                      <div>{diagnosticData.environment?.typescriptVersion}</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      API Keys
                      <Badge variant={
                        diagnosticData.apiKeys?.publicKeyConfigured && diagnosticData.apiKeys?.privateKeyConfigured
                          ? "success"
                          : "destructive"
                      } className="text-xs">
                        {diagnosticData.apiKeys?.publicKeyConfigured && diagnosticData.apiKeys?.privateKeyConfigured
                          ? "Both keys configured"
                          : "Missing keys"
                        }
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Public Key</div>
                      <div className="flex items-center gap-2">
                        {diagnosticData.apiKeys?.publicKeyConfigured ? 
                          <><CheckCircle className="h-4 w-4 text-green-500" /> {diagnosticData.apiKeys?.publicKeyPreview}</> : 
                          <><XCircle className="h-4 w-4 text-red-500" /> Not configured</>
                        }
                      </div>
                      <div className="text-muted-foreground">Private Key</div>
                      <div className="flex items-center gap-2">
                        {diagnosticData.apiKeys?.privateKeyConfigured ? 
                          <><CheckCircle className="h-4 w-4 text-green-500" /> {diagnosticData.apiKeys?.privateKeyPreview}</> : 
                          <><XCircle className="h-4 w-4 text-red-500" /> Not configured</>
                        }
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      HMAC Signature Test
                      <Badge variant={diagnosticData.hmacTest?.success ? "success" : "destructive"} className="text-xs">
                        {diagnosticData.hmacTest?.success ? "Success" : "Failed"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    {diagnosticData.hmacTest?.success ? (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Signature Length</div>
                        <div>{diagnosticData.hmacTest?.signatureLength} characters</div>
                        <div className="text-muted-foreground">Signature Preview</div>
                        <div>{diagnosticData.hmacTest?.signaturePreview}</div>
                      </div>
                    ) : (
                      <Alert variant="destructive">
                        <AlertTitle>HMAC Signature Generation Failed</AlertTitle>
                        <AlertDescription>
                          {diagnosticData.hmacTest?.error || "Unknown error generating HMAC signature"}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      Network Connectivity Test
                      <Badge variant={diagnosticData.networkTest?.success ? "success" : "destructive"} className="text-xs">
                        {diagnosticData.networkTest?.success ? "Connected" : "Failed"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    {diagnosticData.networkTest?.success ? (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Status Code</div>
                        <div>{diagnosticData.networkTest?.status}</div>
                        <div className="text-muted-foreground">Status Text</div>
                        <div>{diagnosticData.networkTest?.statusText}</div>
                      </div>
                    ) : (
                      <Alert variant="destructive">
                        <AlertTitle>Network Connectivity Test Failed</AlertTitle>
                        <AlertDescription>
                          {diagnosticData.networkTest?.error || 
                           `Status: ${diagnosticData.networkTest?.status}, ${diagnosticData.networkTest?.statusText}`}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      Full Ping API Test
                      <Badge variant={diagnosticData.fullPingTest?.success ? "success" : "destructive"} className="text-xs">
                        {diagnosticData.fullPingTest?.success ? "Success" : "Failed"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    {diagnosticData.fullPingTest?.success ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">Status Code</div>
                          <div>{diagnosticData.fullPingTest?.status}</div>
                          <div className="text-muted-foreground">Status Text</div>
                          <div>{diagnosticData.fullPingTest?.statusText}</div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Response Data</h4>
                          <pre className="text-xs bg-muted/30 p-3 rounded overflow-x-auto">
                            {JSON.stringify(diagnosticData.fullPingTest?.responseData || diagnosticData.fullPingTest?.responseText, null, 2)}
                          </pre>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Request Details</h4>
                          <pre className="text-xs bg-muted/30 p-3 rounded overflow-x-auto">
                            {JSON.stringify(diagnosticData.fullPingTest?.requestDetails, null, 2)}
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <Alert variant="destructive">
                        <AlertTitle>Full Ping API Test Failed</AlertTitle>
                        <AlertDescription>
                          {diagnosticData.fullPingTest?.error || "Unknown error during full ping test"}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2">
        {activeTab === 'basic' ? (
          <Button 
            onClick={handleCheckConnection} 
            disabled={isChecking}
            className="gap-2"
          >
            {isChecking ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            {isChecking ? 'Checking Connection...' : 'Check Connection'}
          </Button>
        ) : (
          <Button 
            onClick={runDiagnostics} 
            disabled={isChecking}
            className="gap-2"
            variant="default"
          >
            {isChecking ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Bug className="h-4 w-4" />}
            {isChecking ? 'Running Diagnostics...' : 'Run Advanced Diagnostics'}
          </Button>
        )}
        
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
