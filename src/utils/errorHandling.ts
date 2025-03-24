
import { toast } from "@/hooks/use-toast";

export type NetworkErrorType = 
  | 'connection-error'
  | 'timeout-error'
  | 'server-error'
  | 'authentication-error'
  | 'api-error'
  | 'crypto-error'
  | 'unknown-error';

export interface NetworkError extends Error {
  type: NetworkErrorType;
  status?: number;
  retry?: () => Promise<any>;
  details?: any;
}

export function isNetworkError(error: any): error is NetworkError {
  return error && 
    typeof error === 'object' && 
    'type' in error &&
    typeof error.type === 'string';
}

export function createNetworkError(
  message: string, 
  type: NetworkErrorType = 'unknown-error', 
  status?: number,
  retry?: () => Promise<any>,
  details?: any
): NetworkError {
  const error = new Error(message) as NetworkError;
  error.type = type;
  if (status) error.status = status;
  if (retry) error.retry = retry;
  if (details) error.details = details;
  return error;
}

export function handleNetworkError(error: any): NetworkError {
  console.error('Network error occurred:', error);
  
  if (isNetworkError(error)) {
    return error;
  }
  
  // Check for specific error types
  if (!navigator.onLine) {
    return createNetworkError(
      'You are currently offline. Please check your internet connection.',
      'connection-error'
    );
  }
  
  if (error.name === 'AbortError') {
    return createNetworkError(
      'Request timed out. Please try again.',
      'timeout-error'
    );
  }
  
  // Enhanced error handling for Edge Functions
  if (error.message && error.message.includes('Edge Function returned a non-2xx status code')) {
    // Extract more details if available
    const statusMatch = error.message.match(/status code: (\d+)/);
    const status = statusMatch ? parseInt(statusMatch[1]) : undefined;
    
    // Try to extract any additional details from the error
    let details = {};
    try {
      if (error.error && typeof error.error === 'string' && error.error.startsWith('{')) {
        details = JSON.parse(error.error);
      } else if (error.data && typeof error.data === 'object') {
        details = error.data;
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
    
    return createNetworkError(
      'Error connecting to Kado API service. Please check the Supabase Edge Function logs for more details.',
      'server-error',
      status,
      undefined,
      details
    );
  }
  
  // Handle cryptographic errors (for Kado HMAC signature issues)
  if (error.message && (
    error.message.includes('Failed to generate signature') ||
    error.message.includes('is not a constructor') ||
    error.message.includes('crypto') ||
    error.message.includes('HMAC')
  )) {
    return createNetworkError(
      'Error generating authentication signature for Kado API. Please check the edge function logs.',
      'crypto-error',
      undefined,
      undefined,
      { originalError: error }
    );
  }
  
  // Handle API key configuration errors with more details
  if (error.message && (
    error.message.includes('API keys not configured') || 
    error.message.includes('Missing API keys')
  )) {
    return createNetworkError(
      'Kado API keys not configured. Please add required API keys to Supabase Edge Function secrets.',
      'authentication-error',
      undefined,
      undefined,
      { 
        missingKeys: error.message.includes('KADO_API_PUBLIC_KEY') ? ['KADO_API_PUBLIC_KEY'] : 
                    error.message.includes('KADO_API_PRIVATE_KEY') ? ['KADO_API_PRIVATE_KEY'] : 
                    ['KADO_API_PUBLIC_KEY', 'KADO_API_PRIVATE_KEY'],
        source: 'edge-function'
      }
    );
  }
  
  // Handle JSON parse errors with more diagnostic information
  if (error.name === 'SyntaxError' && error.message.includes('Unexpected token')) {
    return createNetworkError(
      'Invalid response format from server. This may indicate an issue with the API or Edge Function.',
      'server-error',
      undefined,
      undefined,
      {
        parseError: error.message,
        position: error.message.match(/position (\d+)/) ? error.message.match(/position (\d+)/)[1] : 'unknown',
        responseSample: error.responseText ? error.responseText.substring(0, 100) + '...' : 'unavailable'
      }
    );
  }
  
  // Handle specific Supabase edge function errors with better diagnostics
  if (error.error && error.error === 'Internal server error') {
    return createNetworkError(
      'Supabase Edge Function encountered an error. Please check the logs for details.',
      'server-error',
      500,
      undefined,
      {
        source: 'supabase-edge-function',
        message: error.message || 'No additional details available'
      }
    );
  }
  
  // Handle specific Kado API errors
  if (error.kadoError || (error.data && error.data.kadoError)) {
    const kadoError = error.kadoError || error.data.kadoError;
    return createNetworkError(
      kadoError.message || 'Kado API returned an error.',
      'api-error',
      kadoError.status || undefined,
      undefined,
      kadoError
    );
  }
  
  if (error.response) {
    const status = error.response.status;
    
    if (status >= 500) {
      return createNetworkError(
        'Server error. Please try again later.',
        'server-error',
        status,
        undefined,
        error.response.data
      );
    }
    
    if (status === 401 || status === 403) {
      return createNetworkError(
        'Authentication error. Please log in again.',
        'authentication-error',
        status,
        undefined,
        error.response.data
      );
    }
    
    return createNetworkError(
      error.response.data?.message || 'An unexpected error occurred.',
      'unknown-error',
      status,
      undefined,
      error.response.data
    );
  }
  
  return createNetworkError(
    'Network error. Please check your connection and try again.',
    'unknown-error',
    undefined,
    undefined,
    { originalError: typeof error === 'object' ? { ...error } : error }
  );
}

export function showErrorToast(error: any): void {
  const networkError = isNetworkError(error) ? error : handleNetworkError(error);
  
  toast({
    title: getErrorTitle(networkError.type),
    description: networkError.message,
    variant: 'destructive',
  });
}

function getErrorTitle(type: NetworkErrorType): string {
  switch (type) {
    case 'connection-error':
      return 'Connection Error';
    case 'timeout-error':
      return 'Request Timeout';
    case 'server-error':
      return 'Server Error';
    case 'authentication-error':
      return 'Authentication Error';
    case 'api-error':
      return 'API Error';
    case 'crypto-error':
      return 'Crypto Error';
    case 'unknown-error':
    default:
      return 'Error';
  }
}
