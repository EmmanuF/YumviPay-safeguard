
// Common types for the API service

export interface RequestOptions extends RequestInit {
  timeout?: number;
  cacheable?: boolean;
  cacheKey?: string;
  cacheTTL?: number; // in milliseconds
  retry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

// Default request options
export const defaultOptions: Partial<RequestOptions> = {
  timeout: 10000, // 10 seconds default timeout
  headers: {
    'Content-Type': 'application/json',
  },
  retry: true,
  maxRetries: 2,
  retryDelay: 500
};
