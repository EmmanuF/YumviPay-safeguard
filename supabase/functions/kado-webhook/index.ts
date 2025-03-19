
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// Constants
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const KADO_API_PUBLIC_KEY = Deno.env.get('KADO_API_PUBLIC_KEY') ?? '';

// Request handler
serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  // Handle OPTIONS preflight request
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

    // Parse request body
    const body = await req.json();
    
    // Validate Kado API key (in a real implementation, this would be a proper signature verification)
    const apiKey = req.headers.get('x-api-key');
    if (!KADO_API_PUBLIC_KEY || apiKey !== KADO_API_PUBLIC_KEY) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Required fields in webhook payload
    if (!body.transaction_id || !body.status) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log webhook receipt
    console.log(`Received Kado webhook for transaction ${body.transaction_id}, status: ${body.status}`);

    // Update transaction status in database
    const { error } = await supabase
      .from('transactions')
      .update({
        status: body.status,
        updated_at: new Date().toISOString(),
        ...(body.status === 'completed' && { completed_at: new Date().toISOString() }),
        ...(body.status === 'failed' && { failure_reason: body.reason }),
      })
      .eq('id', body.transaction_id);

    if (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }

    console.log(`Successfully updated transaction ${body.transaction_id} to ${body.status}`);

    // Return success response
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
