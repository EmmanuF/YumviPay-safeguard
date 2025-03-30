
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const EXCHANGE_RATE_API_URL = "https://v6.exchangerate-api.com/v6";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    // Parse request
    const { baseCurrency = "USD" } = await req.json();
    
    // Get API key from environment variables
    const apiKey = Deno.env.get("EXCHANGE_RATE_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: "API keys not configured",
          message: "Exchange Rate API key is not configured in Supabase Edge Function secrets"
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500
        }
      );
    }
    
    // Construct API URL with API key
    const apiUrl = `${EXCHANGE_RATE_API_URL}/${apiKey}/latest/${baseCurrency}`;
    console.log(`Fetching rates from: ${apiUrl}`);
    
    // Fetch exchange rates from the API
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Exchange rate API error:", errorText);
      return new Response(
        JSON.stringify({ 
          error: "API Error",
          status: response.status,
          message: `Error fetching exchange rates: ${response.statusText}`,
          details: errorText
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: response.status
        }
      );
    }
    
    // Parse and return the response
    const data = await response.json();
    
    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    console.error("Error in exchange rates function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Server Error",
        message: error.message || "An unexpected error occurred"
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
