
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
    let body;
    try {
      body = await req.json();
      console.log("Received request with body:", JSON.stringify(body));
    } catch (e) {
      console.error("Error parsing request body:", e);
      return new Response(
        JSON.stringify({ 
          error: "Invalid Request", 
          message: "Could not parse request body"
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400
        }
      );
    }
    
    const { baseCurrency = "USD" } = body || {};
    console.log("Processing request for base currency:", baseCurrency);
    
    // Get API key from environment variables
    const apiKey = Deno.env.get("EXCHANGE_RATE_API_KEY");
    if (!apiKey) {
      console.error("API key not configured");
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
    console.log(`Fetching rates from: ${apiUrl.replace(apiKey, "API_KEY_HIDDEN")}`);
    
    // Fetch exchange rates from the API
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    console.log("Exchange API response status:", response.status);
    
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
    console.log("Successfully retrieved rates with base currency:", data.base_code);
    console.log("Last updated:", data.time_last_update_utc);
    console.log("Sample rates:", {
      EUR: data.conversion_rates.EUR,
      GBP: data.conversion_rates.GBP,
      XAF: data.conversion_rates.XAF
    });
    
    // Standardize the response format to match our application's expected structure
    const standardizedResponse = {
      base: data.base_code,
      rates: data.conversion_rates,
      time_last_update_utc: data.time_last_update_utc
    };
    
    return new Response(
      JSON.stringify(standardizedResponse),
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
