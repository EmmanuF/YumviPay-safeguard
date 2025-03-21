
import { createClient } from '@supabase/supabase-js';

// Get environment variables with meaningful fallbacks for development
// NOTE: In production, these values should be set in your environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bccjymakoczdswgflctv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjY2p5bWFrb2N6ZHN3Z2ZsY3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NzE0NjYsImV4cCI6MjA1NzE0NzQ2Nn0.Hiy1PCICQBOaEDaqQPa4jzEt7lN9mMr0oapQCin7hcg';

console.log("Initializing Supabase client with URL:", supabaseUrl);

// Create and configure the Supabase client with persistent sessions
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage
  }
});

// Check if Supabase is accessible on app initialization
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    console.log("Testing Supabase connection...");
    // Simple health check query
    const { data, error } = await supabase.from('countries').select('count');
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    console.log('Supabase connection successful');
    return true;
  } catch (err) {
    console.error('Supabase connection test error:', err);
    return false;
  }
};
