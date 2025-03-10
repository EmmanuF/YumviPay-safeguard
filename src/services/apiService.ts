
import { useNetwork } from '@/contexts/NetworkContext';
import { toast } from '@/hooks/use-toast';

// Base API URL - would be set based on environment
const API_BASE_URL = 'https://api.yumvi-pay.com'; // Replace with your actual API base URL

// Common headers
const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Add auth header if user is logged in
    ...(localStorage.getItem('authToken') ? {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    } : {})
  };
};

// Generic fetch function with error handling
export const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const { isOffline } = useNetwork();
    
    if (isOffline) {
      throw new Error('You are currently offline. Please try again when your connection is restored.');
    }
    
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      ...getHeaders(),
      ...options.headers
    };
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    
    // Show toast notification for API errors
    toast({
      title: 'Request failed',
      description: error instanceof Error ? error.message : 'An unknown error occurred',
      variant: 'destructive'
    });
    
    throw error;
  }
};

// API methods
export const apiService = {
  // Auth endpoints
  auth: {
    login: (email: string, password: string) => 
      apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }),
      
    register: (userData: any) => 
      apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),
      
    logout: () => 
      apiFetch('/auth/logout', {
        method: 'POST'
      })
  },
  
  // Transactions endpoints
  transactions: {
    getAll: () => 
      apiFetch<any[]>('/transactions'),
      
    getById: (id: string) => 
      apiFetch<any>(`/transactions/${id}`),
      
    create: (transactionData: any) => 
      apiFetch<any>('/transactions', {
        method: 'POST',
        body: JSON.stringify(transactionData)
      }),
      
    update: (id: string, data: any) => 
      apiFetch<any>(`/transactions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      })
  },
  
  // Recipients endpoints
  recipients: {
    getAll: () => 
      apiFetch<any[]>('/recipients'),
      
    getById: (id: string) => 
      apiFetch<any>(`/recipients/${id}`),
      
    create: (recipientData: any) => 
      apiFetch<any>('/recipients', {
        method: 'POST',
        body: JSON.stringify(recipientData)
      }),
      
    update: (id: string, data: any) => 
      apiFetch<any>(`/recipients/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }),
      
    delete: (id: string) => 
      apiFetch<void>(`/recipients/${id}`, {
        method: 'DELETE'
      })
  },
  
  // Countries endpoints
  countries: {
    getAll: () => 
      apiFetch<any[]>('/countries'),
      
    getSendingCountries: () => 
      apiFetch<any[]>('/countries/sending'),
      
    getReceivingCountries: () => 
      apiFetch<any[]>('/countries/receiving')
  },
  
  // Payment methods endpoints
  paymentMethods: {
    getByCountry: (countryCode: string) => 
      apiFetch<any[]>(`/payment-methods/${countryCode}`)
  }
};

// Hook for using API in components
export const useApi = () => {
  const network = useNetwork();
  
  return {
    api: apiService,
    isOffline: network.isOffline
  };
};
