
import { supabase } from '@/integrations/supabase/client';
import { isOffline, addPausedRequest } from '@/utils/networkUtils';

// API base URL
const API_BASE_URL = '/api';

// Generic fetch function with offline handling
export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  try {
    // Check if we're offline
    if (isOffline()) {
      console.log(`Network offline, queueing request to ${endpoint}`);
      
      // Add request to queue to be processed when back online
      return new Promise((resolve, reject) => {
        addPausedRequest(async () => {
          try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
            const data = await response.json();
            resolve(data);
            return data;
          } catch (error) {
            console.error('Error processing queued request:', error);
            reject(error);
            throw error;
          }
        });
      });
    }
    
    // If online, process normally
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Helper methods for common CRUD operations
export const apiService = {
  // GET all resources
  getAll: async (resource: string): Promise<any[]> => {
    return apiFetch(`/${resource}`);
  },
  
  // GET a specific resource by ID
  getById: async (resource: string, id: string): Promise<any> => {
    return apiFetch(`/${resource}/${id}`);
  },
  
  // POST a new resource
  create: async (resource: string, data: any): Promise<any> => {
    return apiFetch(`/${resource}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },
  
  // PUT or PATCH an existing resource
  update: async (resource: string, id: string, data: any, method = 'PATCH'): Promise<any> => {
    return apiFetch(`/${resource}/${id}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },
  
  // DELETE a resource
  delete: async (resource: string, id: string): Promise<void> => {
    await apiFetch(`/${resource}/${id}`, {
      method: 'DELETE',
    });
  },
};

export default apiService;
