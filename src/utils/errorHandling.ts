
import { toast } from "@/hooks/use-toast";

export type NetworkErrorType = 
  | 'connection-error'
  | 'timeout-error'
  | 'server-error'
  | 'authentication-error'
  | 'unknown-error';

export interface NetworkError extends Error {
  type: NetworkErrorType;
  status?: number;
  retry?: () => Promise<any>;
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
  retry?: () => Promise<any>
): NetworkError {
  const error = new Error(message) as NetworkError;
  error.type = type;
  if (status) error.status = status;
  if (retry) error.retry = retry;
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
  
  // Handle Supabase Edge Function errors
  if (error.message && error.message.includes('Edge Function returned a non-2xx status code')) {
    // This likely means the edge function encountered an error
    return createNetworkError(
      'Error connecting to Kado API service. Please check your Supabase Edge Function logs.',
      'server-error'
    );
  }
  
  // Handle API key configuration errors
  if (error.message && (
    error.message.includes('API keys not configured') || 
    error.message.includes('Missing API keys')
  )) {
    return createNetworkError(
      'Kado API keys not configured. Please add required API keys to Supabase Edge Function secrets.',
      'authentication-error'
    );
  }
  
  // Handle specific Supabase edge function errors with more meaningful messages
  if (error.error && error.error === 'Internal server error') {
    return createNetworkError(
      'Supabase Edge Function encountered an error. Please check the logs for details.',
      'server-error'
    );
  }
  
  if (error.response) {
    const status = error.response.status;
    
    if (status >= 500) {
      return createNetworkError(
        'Server error. Please try again later.',
        'server-error',
        status
      );
    }
    
    if (status === 401 || status === 403) {
      return createNetworkError(
        'Authentication error. Please log in again.',
        'authentication-error',
        status
      );
    }
    
    return createNetworkError(
      error.response.data?.message || 'An unexpected error occurred.',
      'unknown-error',
      status
    );
  }
  
  return createNetworkError(
    'Network error. Please check your connection and try again.',
    'unknown-error'
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
    case 'unknown-error':
    default:
      return 'Error';
  }
}
