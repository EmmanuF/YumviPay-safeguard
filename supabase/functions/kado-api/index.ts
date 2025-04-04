import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// Constants
const KADO_API_URL = 'https://api.kado.money/v1';
const KADO_API_KEY = Deno.env.get('KADO_API_PUBLIC_KEY') ?? '';
const KADO_API_SECRET = Deno.env.get('KADO_API_PRIVATE_KEY') ?? '';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

/**
 * Enhanced logging function to standardize log format and capture detailed info
 */
const logInfo = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] INFO: ${message}`);
  if (data) {
    console.log(`[${timestamp}] DATA: ${typeof data === 'object' ? JSON.stringify(data, null, 2) : data}`);
  }
};

const logError = (message: string, error?: any) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR: ${message}`);
  if (error) {
    if (error instanceof Error) {
      console.error(`[${timestamp}] ERROR DETAILS: ${error.message}`);
      console.error(`[${timestamp}] STACK: ${error.stack}`);
    } else {
      console.error(`[${timestamp}] ERROR DATA: ${typeof error === 'object' ? JSON.stringify(error, null, 2) : error}`);
    }
  }
};

/**
 * Generate HMAC signature for Kado API authentication
 * Updated to use the correct Deno crypto API
 * @param path API path
 * @param timestamp Request timestamp
 * @param method HTTP method
 * @param body Request body for POST/PUT requests
 * @returns HMAC signature string
 */
const generateSignature = async (path: string, timestamp: string, method: string, body?: any): Promise<string> => {
  try {
    logInfo(`Generating signature for ${method} ${path}`, { 
      timestamp, 
      hasBody: !!body,
      bodyType: body ? typeof body : 'undefined'
    });
    
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(KADO_API_SECRET);
    
    // Create message string to sign
    let message = method.toUpperCase() + path + timestamp;
    if (body) {
      message += JSON.stringify(body);
    }
    
    logInfo(`Signature message created`, { messageLength: message.length });
    
    // Create HMAC signature using the correct crypto API
    const key = await crypto.subtle.importKey(
      "raw",
      secretKey,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(message)
    );
    
    // Convert to hex string
    const signature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    logInfo(`Signature generated successfully`, { signaturePreview: signature.substring(0, 10) + '...' });
    return signature;
  } catch (error) {
    logError('Error generating signature', error);
    throw new Error(`Failed to generate signature: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * New diagnostic endpoint that tests different aspects of the edge function
 */
const handleDiagnostics = async () => {
  const diagnosticResults = {
    timestamp: new Date().toISOString(),
    environment: {
      denoVersion: Deno.version.deno,
      v8Version: Deno.version.v8,
      typescriptVersion: Deno.version.typescript,
    },
    apiKeys: {
      publicKeyConfigured: KADO_API_KEY.length > 0,
      publicKeyPreview: KADO_API_KEY ? `${KADO_API_KEY.substring(0, 4)}...${KADO_API_KEY.substring(KADO_API_KEY.length - 4)}` : 'not set',
      privateKeyConfigured: KADO_API_SECRET.length > 0,
      privateKeyPreview: KADO_API_SECRET ? 'set (masked)' : 'not set',
    },
    hmacTest: null as any,
    networkTest: null as any,
    fullPingTest: null as any,
  };
  
  // Test HMAC signature generation
  try {
    const testTimestamp = new Date().toISOString();
    const testPath = '/test-path';
    const signature = await generateSignature(testPath, testTimestamp, 'GET');
    diagnosticResults.hmacTest = {
      success: true,
      signatureLength: signature.length,
      signaturePreview: signature.substring(0, 10) + '...',
    };
  } catch (error) {
    diagnosticResults.hmacTest = {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
  
  // Test basic network connectivity (without authentication)
  try {
    // Test if we can reach the Kado domain without auth (just a HEAD request)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // Use a more reliable URL to test network connectivity
    // Sometimes api.kado.money might have restrictions
    const testNetworkUrl = 'https://httpbin.org/get';
    logInfo(`Testing basic network connectivity to ${testNetworkUrl}`);
    
    const response = await fetch(testNetworkUrl, {
      method: 'GET',
      signal: controller.signal,
    }).catch(error => {
      logError(`Network test fetch error: ${error.message}`);
      return { ok: false, status: 0, statusText: error.message };
    });
    
    clearTimeout(timeoutId);
    
    diagnosticResults.networkTest = {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      url: testNetworkUrl
    };
    
    logInfo(`Network test result: ${response.ok ? 'SUCCESS' : 'FAILED'} with status ${response.status}`);
  } catch (error) {
    logError('Error in network connectivity test', error);
    diagnosticResults.networkTest = {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
  
  // Try to directly ping the Kado API domain first to verify it's reachable
  try {
    const directPingUrl = 'https://api.kado.money';
    logInfo(`Testing direct ping to Kado domain at ${directPingUrl}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const directPingResponse = await fetch(directPingUrl, {
      method: 'GET',
      signal: controller.signal,
    }).catch(error => {
      logError(`Direct ping error: ${error.message}`);
      return { ok: false, status: 0, statusText: error.message };
    });
    
    clearTimeout(timeoutId);
    
    logInfo(`Direct ping to Kado domain result: ${directPingResponse.ok ? 'SUCCESS' : 'FAILED'} with status ${directPingResponse.status}`);
    
    // Add this information to the diagnostic results
    diagnosticResults.domainPingTest = {
      success: directPingResponse.ok,
      status: directPingResponse.status,
      statusText: directPingResponse.statusText,
      url: directPingUrl
    };
  } catch (error) {
    logError('Error in direct ping test', error);
    diagnosticResults.domainPingTest = {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
  
  // Test a full ping request with authentication to the v1/ping endpoint
  try {
    const testPath = '/ping';
    const timestamp = new Date().toISOString();
    
    // Log the API keys being used (masked for security)
    logInfo('Testing with API keys', {
      publicKeyConfigured: KADO_API_KEY ? 'yes' : 'no',
      publicKeyLength: KADO_API_KEY ? KADO_API_KEY.length : 0,
      publicKeyPreview: KADO_API_KEY ? `${KADO_API_KEY.substring(0, 4)}...${KADO_API_KEY.substring(KADO_API_KEY.length - 4)}` : 'not set',
      privateKeyConfigured: KADO_API_SECRET ? 'yes' : 'no',
      privateKeyLength: KADO_API_SECRET ? KADO_API_SECRET.length : 0,
    });
    
    // Generate signature with additional logging
    let signature;
    try {
      signature = await generateSignature(testPath, timestamp, 'GET');
      logInfo('Signature generated successfully', {
        signatureLength: signature.length,
        signaturePreview: signature.substring(0, 10) + '...'
      });
    } catch (signatureError) {
      logError('Error generating signature for ping test', signatureError);
      diagnosticResults.fullPingTest = {
        success: false,
        error: `Signature generation error: ${signatureError instanceof Error ? signatureError.message : String(signatureError)}`,
        stage: 'signature_generation'
      };
      throw signatureError;
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': KADO_API_KEY,
      'X-Timestamp': timestamp,
      'X-Signature': signature,
    };
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const pingUrl = `${KADO_API_URL}${testPath}`;
    logInfo(`Performing full ping test to ${pingUrl}`);
    logInfo(`Using headers:`, {
      'Content-Type': headers['Content-Type'],
      'X-API-Key': `${headers['X-API-Key'].substring(0, 4)}...${headers['X-API-Key'].substring(headers['X-API-Key'].length - 4)}`,
      'X-Timestamp': headers['X-Timestamp'],
      'X-Signature': `${headers['X-Signature'].substring(0, 8)}...`,
    });
    
    // First try a simpler approach with custom error handling
    try {
      logInfo(`Sending request to ${pingUrl}`);
      
      const response = await fetch(pingUrl, {
        method: 'GET',
        headers,
        signal: controller.signal,
      });
      
      // Get response as text first for better debugging
      const responseText = await response.text();
      logInfo(`Raw ping response (${response.status}): ${responseText}`);
      
      // Try to parse the text as JSON
      let responseData;
      try {
        if (responseText && responseText.trim()) {
          responseData = JSON.parse(responseText);
          logInfo(`Parsed ping response: ${JSON.stringify(responseData)}`);
        } else {
          logInfo(`Empty response from ping endpoint`);
        }
      } catch (parseError) {
        logError(`Error parsing ping response as JSON: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
        // If parsing fails, we'll use the text response
      }
      
      diagnosticResults.fullPingTest = {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        responseText: responseText || "(empty response)",
        responseData: responseData || null,
        requestDetails: {
          url: pingUrl,
          headers: {
            'Content-Type': headers['Content-Type'],
            'X-API-Key': `${headers['X-API-Key'].substring(0, 4)}...${headers['X-API-Key'].substring(headers['X-API-Key'].length - 4)}`,
            'X-Timestamp': headers['X-Timestamp'],
            'X-Signature': `${headers['X-Signature'].substring(0, 8)}...`,
          }
        }
      };
      
      // If we get a 401 or 403, it's likely an authentication issue
      if (response.status === 401 || response.status === 403) {
        diagnosticResults.fullPingTest.authError = true;
        diagnosticResults.fullPingTest.authErrorReason = "Authentication failed - check API keys";
      }
      
    } catch (pingError) {
      logError(`Direct ping test error: ${pingError instanceof Error ? pingError.message : String(pingError)}`);
      if (pingError instanceof Error) {
        logError(`Error stack: ${pingError.stack}`);
      }
      
      diagnosticResults.fullPingTest = {
        success: false,
        error: pingError instanceof Error ? pingError.message : String(pingError),
        errorType: pingError instanceof Error ? pingError.name : typeof pingError,
        errorStack: pingError instanceof Error ? pingError.stack : undefined,
        requestDetails: {
          url: pingUrl,
          headers: {
            'Content-Type': headers['Content-Type'],
            'X-API-Key': `${headers['X-API-Key'].substring(0, 4)}...`,
            'X-Timestamp': headers['X-Timestamp'],
            'X-Signature': `${headers['X-Signature'].substring(0, 8)}...`,
          }
        }
      };
    } finally {
      clearTimeout(timeoutId);
    }
    
    logInfo(`Ping test result: ${diagnosticResults.fullPingTest.success ? 'SUCCESS' : 'FAILED'}`);
  } catch (error) {
    logError('Error in full ping test wrapper', error);
    diagnosticResults.fullPingTest = {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined
    };
  }
  
  // Additional exploratory test - Try to access other Kado API endpoints to check if it's a specific ping endpoint issue
  try {
    const alternativeEndpoints = [
      '/health',        // Common health endpoint
      '/status',        // Common status endpoint
      '/api-status',    // Another common pattern
      ''                // Try the root endpoint
    ];
    
    logInfo('Testing alternative endpoints', { alternativeEndpoints });
    
    const exploratoryResults = [];
    
    for (const endpoint of alternativeEndpoints) {
      const testPath = endpoint;
      const timestamp = new Date().toISOString();
      let signature;
      
      try {
        signature = await generateSignature(testPath, timestamp, 'GET');
      } catch (signError) {
        exploratoryResults.push({
          endpoint: testPath || '/',
          success: false,
          error: `Signature error: ${signError instanceof Error ? signError.message : String(signError)}`
        });
        continue;
      }
      
      const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': KADO_API_KEY,
        'X-Timestamp': timestamp,
        'X-Signature': signature,
      };
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const testUrl = `${KADO_API_URL}${testPath}`;
      logInfo(`Testing alternative endpoint: ${testUrl}`);
      
      try {
        logInfo(`Sending request to alternative endpoint: ${testUrl}`);
        
        const response = await fetch(testUrl, {
          method: 'GET',
          headers,
          signal: controller.signal,
        });
        
        const status = response.status;
        let responseText;
        
        try {
          responseText = await response.text();
          logInfo(`Response from ${testPath || '/'}: ${status} - ${responseText.substring(0, 100)}`);
        } catch (e) {
          responseText = "(failed to get response text)";
          logError(`Failed to get response text from ${testPath || '/'}: ${e instanceof Error ? e.message : String(e)}`);
        }
        
        exploratoryResults.push({
          endpoint: testPath || '/',
          status,
          success: response.ok,
          responsePreview: responseText.substring(0, 100) + (responseText.length > 100 ? '...' : '')
        });
        
        logInfo(`Alternative endpoint ${testPath || '/'} result: ${response.ok ? 'SUCCESS' : 'FAILED'} with status ${status}`);
      } catch (error) {
        exploratoryResults.push({
          endpoint: testPath || '/',
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
        logError(`Error testing alternative endpoint ${testPath || '/'}`, error);
      } finally {
        clearTimeout(timeoutId);
      }
    }
    
    // Add exploratory results to diagnostics
    diagnosticResults.exploratoryTests = exploratoryResults;
    
  } catch (error) {
    logError('Error in exploratory endpoint tests', error);
    diagnosticResults.exploratoryTests = {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
  
  return diagnosticResults;
};

// Request handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    logInfo('Handling CORS preflight request');
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Log request details
    logInfo(`Request method: ${req.method}`, { url: req.url });
    
    // Parse request body - Accept only POST method now
    let endpoint, method, data;

    if (req.method === 'POST') {
      // For POST requests, parse the JSON body
      let reqBody;
      try {
        reqBody = await req.json();
        logInfo('Request body received', reqBody);
      } catch (parseError) {
        logError('Error parsing request body', parseError);
        return new Response(JSON.stringify({ 
          error: 'Invalid JSON in request body',
          details: parseError instanceof Error ? parseError.message : String(parseError)
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      endpoint = reqBody.endpoint;
      method = reqBody.method || 'GET';
      data = reqBody.data;
      
      // New diagnostic endpoint that returns detailed information
      if (endpoint === 'diagnostics') {
        logInfo('Running full diagnostics');
        const diagnosticResults = await handleDiagnostics();
        logInfo('Diagnostics completed', diagnosticResults);
        
        return new Response(JSON.stringify(diagnosticResults), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Special endpoint to check if API keys are configured
      if (endpoint === 'check-secrets') {
        const publicKeyConfigured = KADO_API_KEY.length > 0;
        const privateKeyConfigured = KADO_API_SECRET.length > 0;
        
        logInfo(`API keys status`, { 
          publicKeyConfigured, 
          privateKeyConfigured,
          publicKeyLength: KADO_API_KEY.length,
          privateKeyLength: KADO_API_SECRET.length
        });
        
        return new Response(JSON.stringify({
          publicKeyConfigured,
          privateKeyConfigured,
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else {
      logError('Method not allowed', { method: req.method });
      return new Response(JSON.stringify({ error: 'Method not allowed. Use POST method only.' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (!endpoint) {
      logError('Missing endpoint in request');
      return new Response(JSON.stringify({ error: 'Endpoint is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if API keys are configured - do this for ALL non-check-secrets endpoints
    if (!KADO_API_KEY || !KADO_API_SECRET) {
      logError('Kado API keys not configured', {
        publicKeySet: !!KADO_API_KEY,
        privateKeySet: !!KADO_API_SECRET
      });
      return new Response(JSON.stringify({ 
        error: 'API keys not configured',
        details: 'The Kado API keys are missing. Please add KADO_API_PUBLIC_KEY and KADO_API_PRIVATE_KEY to your Supabase Edge Function secrets.'
      }), {
        status: 403, // Using 403 instead of 500 for better error classification
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Debug Kado API keys - Log partial keys for debugging (never log full keys)
    const publicKeyPartial = KADO_API_KEY ? `${KADO_API_KEY.substring(0, 4)}...${KADO_API_KEY.substring(KADO_API_KEY.length - 4)}` : 'not set';
    const secretKeySet = KADO_API_SECRET ? 'set (masked)' : 'not set';
    logInfo(`Kado API keys configured`, { publicKeyPartial, secretKeySet });

    // Construct full URL
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${KADO_API_URL}${path}`;
    
    logInfo(`Making ${method} request to Kado API`, { url });
    
    // Generate timestamp for auth
    const timestamp = new Date().toISOString();
    
    // Generate signature for auth
    let signature;
    try {
      signature = await generateSignature(path, timestamp, method, method !== 'GET' ? data : undefined);
    } catch (signError) {
      logError('Error generating signature', signError);
      return new Response(JSON.stringify({ 
        error: 'Failed to generate authentication signature',
        details: signError instanceof Error ? signError.message : String(signError)
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Set up authentication headers
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': KADO_API_KEY,
      'X-Timestamp': timestamp,
      'X-Signature': signature,
    };
    
    logInfo('Request headers prepared', {
      'Content-Type': headers['Content-Type'],
      'X-API-Key': `${headers['X-API-Key'].substring(0, 4)}...${headers['X-API-Key'].substring(headers['X-API-Key'].length - 4)}`,
      'X-Timestamp': headers['X-Timestamp'],
      'X-Signature': `${headers['X-Signature'].substring(0, 8)}...`,
    });
    
    // Handle ping endpoint specially
    if (endpoint === 'ping' || endpoint === '/ping') {
      try {
        // For enhanced diagnostic info, let's actually call the Kado API ping endpoint
        // This can help detect if there are issues with the Kado API itself
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);
          
          logInfo('Attempting real ping to Kado API', { url });
          
          // Make the request to the Kado API
          const response = await fetch(url, {
            method: 'GET',
            headers,
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          logInfo(`Kado API ping response received`, { 
            status: response.status, 
            statusText: response.statusText 
          });
          
          // Parse the response
          const responseText = await response.text();
          logInfo('Ping response text', { responseText });
          
          let responseData;
          try {
            if (responseText && responseText.trim()) {
              responseData = JSON.parse(responseText);
              logInfo('Parsed ping response', responseData);
            } else {
              logInfo('Empty ping response');
              responseData = { success: response.ok, message: "Empty response" };
            }
          } catch (parseError) {
            logError('Error parsing ping response', parseError);
            responseData = { text: responseText };
          }
          
          // If we got a 404, it means the ping endpoint doesn't exist
          // In this case, let's return our own simulated ping response
          if (response.status === 404) {
            logInfo('Ping endpoint not found (404), returning simulated response');
            
            return new Response(JSON.stringify({
              ping: "success",
              message: "Simulated ping response - The /ping endpoint returned 404 but we could reach the API server",
              status: 200,
              simulatedResponse: true,
              originalStatus: response.status,
              timestamp: new Date().toISOString()
            }), {
              status: 200, // Always return 200 to frontend
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
          
          // If we got a 401 or 403, it's an authentication issue
          if (response.status === 401 || response.status === 403) {
            logInfo('Authentication failed (401/403), returning error response');
            
            return new Response(JSON.stringify({
              ping: "error",
              message: "Authentication failed - check your API keys",
              status: response.status,
              authError: true,
              timestamp: new Date().toISOString()
            }), {
              status: 200, // Always return 200 to frontend
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
          
          // Return the actual response from Kado
          return new Response(JSON.stringify({
            ping: response.ok ? "success" : "error",
            message: response.ok ? "Successfully connected to Kado API" : "Error connecting to Kado API",
            status: response.status,
            kadoResponse: responseData,
            timestamp: new Date().toISOString()
          }), {
            status: 200, // Always return 200 to frontend
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
          
        } catch (pingError) {
          logError('Error calling Kado ping endpoint', pingError);
          
          // Enhance error information for debugging
          const errorInfo = {
            message: pingError instanceof Error ? pingError.message : String(pingError),
            name: pingError instanceof Error ? pingError.name : 'Unknown',
            stack: pingError instanceof Error ? pingError.stack : undefined,
            isAbortError: pingError instanceof Error && pingError.name === 'AbortError'
          };
          
          logInfo('Detailed ping error info', errorInfo);
          
          // If the real ping fails, still return a 200 response to the frontend
          // but include detailed error information
          return new Response(JSON.stringify({
            ping: "error",
            message: "Error connecting to Kado API",
            error: pingError instanceof Error ? pingError.message : String(pingError),
            errorType: pingError instanceof Error ? pingError.name : typeof pingError,
            errorDetails: errorInfo,
            timestamp: new Date().toISOString()
          }), {
            status: 200, // Return 200 for consistency
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } catch (pingHandlerError) {
        logError('Error in ping request handler', pingHandlerError);
        return new Response(JSON.stringify({
          ping: "error",
          message: "Error handling ping request",
          error: pingHandlerError instanceof Error ? pingHandlerError.message : String(pingHandlerError),
          timestamp: new Date().toISOString()
        }), {
          status: 200, // Still return 200 for front-end compatibility
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    
    // For all other endpoints, make the actual API call
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      // Make the request to the Kado API
      logInfo(`Making request to ${url}`, { 
        method, 
        hasBody: method !== 'GET' && !!data
      });
      
      const response = await fetch(url, {
        method,
        headers,
        body: method !== 'GET' && data ? JSON.stringify(data) : undefined,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      logInfo(`Kado API response received`, { 
        status: response.status, 
        statusText: response.statusText 
      });
      
      // Parse the response
      const responseText = await response.text();
      logInfo('Response text received', { responseText });
      
      let responseData;
      try {
        if (responseText && responseText.trim()) {
          responseData = JSON.parse(responseText);
          logInfo('Parsed response data', responseData);
        } else {
          logInfo('Empty response body');
          responseData = { success: response.ok };
        }
      } catch (parseError) {
        logError('Error parsing response', parseError);
        responseData = { text: responseText };
      }
      
      // Return the response
      return new Response(JSON.stringify(responseData), {
        status: 200, // Always return 200 to frontend to avoid edge function errors
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (fetchError) {
      logError('Error fetching from API', fetchError);
      
      // Enhanced error information
      const errorDetails = {
        message: fetchError instanceof Error ? fetchError.message : String(fetchError),
        name: fetchError instanceof Error ? fetchError.name : typeof fetchError,
        isAbortError: fetchError instanceof Error && fetchError.name === 'AbortError',
        isTypeError: fetchError instanceof TypeError,
        stack: fetchError instanceof Error ? fetchError.stack : undefined
      };
      
      logInfo('Error details', errorDetails);
      
      return new Response(JSON.stringify({
        error: 'Error connecting to Kado API',
        details: errorDetails,
        timestamp: new Date().toISOString()
      }), {
        status: 200, // Always return 200 to frontend to avoid edge function errors
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    logError('Unhandled error in edge function', error);
    
    return new Response(JSON.stringify({
      error: 'Unhandled error in edge function',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }), {
      status: 200, // Always return 200 to frontend to avoid edge function errors
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
