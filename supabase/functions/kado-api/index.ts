
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// Constants
const KADO_API_URL = 'https://api.kado.money/v1';
const KADO_API_KEY = Deno.env.get('KADO_API_KEY') ?? '';
const KADO_API_SECRET = Deno.env.get('KADO_API_SECRET') ?? '';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Request handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Verify request is POST
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if API keys are configured
    if (!KADO_API_KEY || !KADO_API_SECRET) {
      console.error('Kado API keys not configured');
      return new Response(JSON.stringify({ 
        error: 'API keys not configured. Please add KADO_API_KEY and KADO_API_SECRET to your environment variables.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const { endpoint, method = 'GET', data } = await req.json();
    
    if (!endpoint) {
      return new Response(JSON.stringify({ error: 'Endpoint is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Construct full URL
    const url = `${KADO_API_URL}/${endpoint.startsWith('/') ? endpoint.substring(1) : endpoint}`;
    
    console.log(`Making ${method} request to Kado API: ${url}`);
    
    // Set up authentication headers
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': KADO_API_KEY,
      // For actual implementation, you would generate the proper auth header
      // For example: 'Authorization': `Bearer ${generateKadoAuthToken(KADO_API_SECRET)}`
    };
    
    // Make the request to Kado API
    const response = await fetch(url, {
      method,
      headers,
      body: method !== 'GET' && data ? JSON.stringify(data) : undefined,
    });
    
    // Get response data
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error(`Kado API error (${response.status}):`, responseData);
      
      return new Response(JSON.stringify({ 
        error: 'Error from Kado API', 
        status: response.status,
        details: responseData 
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Return success response
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
