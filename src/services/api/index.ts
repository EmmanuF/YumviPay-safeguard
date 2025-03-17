
import { apiRequest } from './handlers';
import { RequestOptions } from './types';
import { clearApiCache } from './cache';

// Export the cache clearing function
export { clearApiCache };

// Export common request types
export { type RequestOptions } from './types';

// Helper functions for common HTTP methods
export const get = <T = any>(url: string, options?: RequestOptions) => 
  apiRequest<T>(url, { ...options, method: 'GET', cacheable: options?.cacheable ?? true });

export const post = <T = any>(url: string, data: any, options?: RequestOptions) => 
  apiRequest<T>(url, { 
    ...options, 
    method: 'POST', 
    body: JSON.stringify(data) 
  });

export const put = <T = any>(url: string, data: any, options?: RequestOptions) => 
  apiRequest<T>(url, { 
    ...options, 
    method: 'PUT', 
    body: JSON.stringify(data) 
  });

export const del = <T = any>(url: string, options?: RequestOptions) => 
  apiRequest<T>(url, { ...options, method: 'DELETE' });
