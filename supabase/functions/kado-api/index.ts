
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
 * Generate HMAC signature for Kado API authentication
 * @param path API path
 * @param timestamp Request timestamp
 * @param method HTTP method
 * @param body Request body for POST/PUT requests
 * @returns HMAC signature string
 */
const generateSignature = (path: string, timestamp: string, method: string, body?: any): string => {
  try {
    const encoder = new TextEncoder();
    const secret = encoder.encode(KADO_API_SECRET);
    
    // Create message string to sign
    let message = method.toUpperCase() + path + timestamp;
    if (body) {
      message += JSON.stringify(body);
    }
    
    // Create HMAC signature
    const hmac = new Deno.HmacSha256(secret);
    hmac.update(encoder.encode(message));
    const signature = Array.from(new Uint8Array(hmac.digest()))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    console.log(`Generated signature for ${method} ${path}`);
    return signature;
  } catch (error) {
    console.error('Error generating signature:', error);
    throw new Error(`Failed to generate signature: ${error.message}`);
  }
};

// Request handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Log request details
    console.log(`Request method: ${req.method}`);
    console.log(`Request URL: ${req.url}`);
    
    // Parse request body - Accept only POST method now
    let endpoint, method, data;

    if (req.method === 'POST') {
      // For POST requests, parse the JSON body
      let reqBody;
      try {
        reqBody = await req.json();
        console.log('Request body:', JSON.stringify(reqBody));
      } catch (parseError) {
        console.error('Error parsing request body:', parseError);
        return new Response(JSON.stringify({ 
          error: 'Invalid JSON in request body',
          details: parseError.message
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      endpoint = reqBody.endpoint;
      method = reqBody.method || 'GET';
      data = reqBody.data;
      
      // Special endpoint to check if API keys are configured
      if (endpoint === 'check-secrets') {
        const publicKeyConfigured = KADO_API_KEY.length > 0;
        const privateKeyConfigured = KADO_API_SECRET.length > 0;
        
        console.log(`API keys status - Public key: ${publicKeyConfigured ? 'Configured' : 'Missing'}, Private key: ${privateKeyConfigured ? 'Configured' : 'Missing'}`);
        
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
      return new Response(JSON.stringify({ error: 'Method not allowed. Use POST method only.' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (!endpoint) {
      console.error('Missing endpoint in request');
      return new Response(JSON.stringify({ error: 'Endpoint is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if API keys are configured - do this for ALL non-check-secrets endpoints
    if (!KADO_API_KEY || !KADO_API_SECRET) {
      console.error('Kado API keys not configured');
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
    console.log(`Kado API keys: Public key: ${publicKeyPartial}, Secret key: ${secretKeySet}`);

    // Construct full URL
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${KADO_API_URL}${path}`;
    
    console.log(`Making ${method} request to Kado API: ${url}`);
    
    // Generate timestamp for auth
    const timestamp = new Date().toISOString();
    
    // Generate signature for auth
    let signature;
    try {
      signature = generateSignature(path, timestamp, method, method !== 'GET' ? data : undefined);
    } catch (signError) {
      console.error('Error generating signature:', signError);
      return new Response(JSON.stringify({ 
        error: 'Failed to generate authentication signature',
        details: signError.message
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
    
    console.log('Request headers:', JSON.stringify({
      'Content-Type': headers['Content-Type'],
      'X-API-Key': `${headers['X-API-Key'].substring(0, 4)}...${headers['X-API-Key'].substring(headers['X-API-Key'].length - 4)}`,
      'X-Timestamp': headers['X-Timestamp'],
      'X-Signature': `${headers['X-Signature'].substring(0, 8)}...`,
    }));
    
    // Handle ping endpoint specially
    if (endpoint === 'ping' || endpoint === '/ping') {
      try {
        // For ping endpoint, always return a success response
        // This helps with initial connection debugging
        return new Response(JSON.stringify({
          ping: "success",
          message: "Ping endpoint is working",
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (pingError) {
        console.error('Error handling ping endpoint:', pingError);
        return new Response(JSON.stringify({
          ping: "error",
          message: "Error handling ping request",
          error: pingError instanceof Error ? pingError.message : String(pingError),
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
      const response = await fetch(url, {
        method,
        headers,
        body: method !== 'GET' && data ? JSON.stringify(data) : undefined,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log(`Kado API response status: ${response.status}`);
      
      // Parse the response
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        responseData = { text: responseText };
      }
      
      // Return the response
      return new Response(JSON.stringify(responseData), {
        status: 200, // Always return 200 to frontend to avoid edge function errors
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (fetchError) {
      console.error('Error fetching from API:', fetchError);
      
      return new Response(JSON.stringify({
        error: 'Error connecting to Kado API',
        message: fetchError instanceof Error ? fetchError.message : String(fetchError),
        timestamp: new Date().toISOString()
      }), {
        status: 200, // Always return 200 to frontend to avoid edge function errors
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Unhandled error in edge function:', error);
    
    return new Response(JSON.stringify({
      error: 'Unhandled error in edge function',
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }), {
      status: 200, // Always return 200 to frontend to avoid edge function errors
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
