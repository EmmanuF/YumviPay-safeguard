
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
    
    // Verify request is POST
    if (req.method !== 'POST') {
      console.error('Method not allowed:', req.method);
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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

    // Parse request body
    const reqBody = await req.json();
    console.log('Request body:', JSON.stringify(reqBody));
    
    const { endpoint, method = 'GET', data } = reqBody;
    
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
    const signature = generateSignature(path, timestamp, method, method !== 'GET' ? data : undefined);
    
    // Set up authentication headers
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': KADO_API_KEY,
      'X-Timestamp': timestamp,
      'X-Signature': signature,
      ...corsHeaders, // Add CORS headers to response
    };
    
    console.log('Request headers:', JSON.stringify(headers, null, 2));
    
    // Make the request to Kado API
    const response = await fetch(url, {
      method,
      headers,
      body: method !== 'GET' && data ? JSON.stringify(data) : undefined,
    });
    
    console.log(`Kado API response status: ${response.status}`);
    
    // For non-OK responses, log headers and response details
    if (!response.ok) {
      console.error(`Kado API error (${response.status}):`);
      const responseText = await response.text();
      console.error('Response body:', responseText);
      
      try {
        const responseData = JSON.parse(responseText);
        return new Response(JSON.stringify({ 
          error: 'Error from Kado API', 
          status: response.status,
          details: responseData 
        }), {
          status: 500, // Return 500 to client but log the actual status
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (parseError) {
        return new Response(JSON.stringify({ 
          error: 'Error from Kado API', 
          status: response.status,
          details: responseText 
        }), {
          status: 500, // Return 500 to client but log the actual status
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    
    // Parse JSON response
    const responseData = await response.json();
    console.log('Kado API response data:', JSON.stringify(responseData, null, 2));
    
    // Return success response
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
