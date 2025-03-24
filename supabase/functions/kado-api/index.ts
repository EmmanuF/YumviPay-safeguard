
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
    
    // Debug Kado API keys - Log partial keys for debugging (never log full keys)
    const publicKeyPartial = KADO_API_KEY ? `${KADO_API_KEY.substring(0, 4)}...${KADO_API_KEY.substring(KADO_API_KEY.length - 4)}` : 'not set';
    const secretKeySet = KADO_API_SECRET ? 'set (masked)' : 'not set';
    console.log(`Kado API keys: Public key: ${publicKeyPartial}, Secret key: ${secretKeySet}`);
    
    // Check if API keys are configured
    if (!KADO_API_KEY || !KADO_API_SECRET) {
      console.error('Kado API keys not configured');
      return new Response(JSON.stringify({ 
        error: 'API keys not configured. Please add KADO_API_PUBLIC_KEY and KADO_API_PRIVATE_KEY to your environment variables.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
    
    // Make the request to Kado API
    let response;
    try {
      response = await fetch(url, {
        method,
        headers,
        body: method !== 'GET' && data ? JSON.stringify(data) : undefined,
      });
    } catch (fetchError) {
      console.error('Network error fetching from Kado API:', fetchError);
      return new Response(JSON.stringify({ 
        error: 'Network error connecting to Kado API',
        details: fetchError.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log(`Kado API response status: ${response.status}`);
    
    // For non-OK responses, log headers and response details
    if (!response.ok) {
      console.error(`Kado API error (${response.status}):`);
      const responseHeaders = Object.fromEntries([...response.headers.entries()]);
      console.error('Response headers:', JSON.stringify(responseHeaders));
      
      const responseText = await response.text();
      console.error('Response body:', responseText);
      
      try {
        const responseData = JSON.parse(responseText);
        return new Response(JSON.stringify({ 
          error: 'Error from Kado API', 
          status: response.status,
          details: responseData 
        }), {
          status: response.status, // Return the actual status from Kado API
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (parseError) {
        return new Response(JSON.stringify({ 
          error: 'Error from Kado API', 
          status: response.status,
          details: responseText 
        }), {
          status: response.status, // Return the actual status from Kado API
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    
    // Parse JSON response
    let responseData;
    try {
      responseData = await response.json();
    } catch (parseError) {
      console.error('Error parsing Kado API response:', parseError);
      const responseText = await response.text();
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON in Kado API response',
        responseText
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log('Kado API response data:', JSON.stringify(responseData));
    
    // Return success response with CORS headers
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
