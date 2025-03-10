
import { Recipient } from '@/types/recipient';
import { Preferences } from '@capacitor/preferences';
import { apiService } from './apiService';
import { useNetwork } from '@/contexts/NetworkContext';

const RECIPIENTS_STORAGE_KEY = 'yumvi_recipients';

// Get all recipients from storage or API
export const getRecipients = async (): Promise<Recipient[]> => {
  const { isOffline } = useNetwork();
  
  // Try to get from API first if online
  if (!isOffline) {
    try {
      const apiRecipients = await apiService.recipients.getAll();
      
      // Cache the recipients for offline use
      await Preferences.set({
        key: RECIPIENTS_STORAGE_KEY,
        value: JSON.stringify(apiRecipients),
      });
      
      return apiRecipients;
    } catch (error) {
      console.error('Error fetching recipients from API:', error);
      // Fallback to local storage on error
    }
  }
  
  // Fallback to local storage if offline or API error
  try {
    const { value } = await Preferences.get({ key: RECIPIENTS_STORAGE_KEY });
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('Error getting recipients from storage:', error);
    return [];
  }
};

// Add a new recipient
export const addRecipient = async (recipient: Omit<Recipient, 'id'>): Promise<Recipient> => {
  const { isOffline, addPausedRequest } = useNetwork();
  
  // Create new recipient with temporary ID
  const newRecipient: Recipient = {
    ...recipient,
    id: `recipient_${Date.now()}`, // Temporary ID
    lastUsed: new Date(),
  };
  
  if (isOffline) {
    // Store locally if offline
    try {
      const recipients = await getRecipients();
      const updatedRecipients = [...recipients, newRecipient];
      
      await Preferences.set({
        key: RECIPIENTS_STORAGE_KEY,
        value: JSON.stringify(updatedRecipients),
      });
      
      // Queue the API call for when connection is restored
      addPausedRequest(async () => {
        try {
          const apiRecipient = await apiService.recipients.create(recipient);
          
          // Update the local storage with the server-generated ID
          const savedRecipients = await getRecipients();
          const updatedRecipients = savedRecipients.map(r => 
            r.id === newRecipient.id ? { ...r, id: apiRecipient.id } : r
          );
          
          await Preferences.set({
            key: RECIPIENTS_STORAGE_KEY,
            value: JSON.stringify(updatedRecipients),
          });
          
          return apiRecipient;
        } catch (error) {
          console.error('Failed to sync new recipient:', error);
          throw error;
        }
      });
      
      return newRecipient;
    } catch (error) {
      console.error('Error adding recipient to storage:', error);
      throw new Error('Failed to add recipient');
    }
  }
  
  try {
    // Send to API if online
    const apiRecipient = await apiService.recipients.create(recipient);
    
    // Update local cache with the server recipient
    const recipients = await getRecipients();
    await Preferences.set({
      key: RECIPIENTS_STORAGE_KEY,
      value: JSON.stringify([...recipients, apiRecipient]),
    });
    
    return apiRecipient;
  } catch (error) {
    console.error('Error adding recipient via API:', error);
    
    // Fallback to local storage on API error
    try {
      const recipients = await getRecipients();
      const updatedRecipients = [...recipients, newRecipient];
      
      await Preferences.set({
        key: RECIPIENTS_STORAGE_KEY,
        value: JSON.stringify(updatedRecipients),
      });
      
      return newRecipient;
    } catch (storageError) {
      console.error('Error adding recipient to storage:', storageError);
      throw new Error('Failed to add recipient');
    }
  }
};

// Update an existing recipient
export const updateRecipient = async (recipient: Recipient): Promise<Recipient> => {
  const { isOffline, addPausedRequest } = useNetwork();
  
  // Update locally first
  try {
    const recipients = await getRecipients();
    const index = recipients.findIndex(r => r.id === recipient.id);
    
    if (index === -1) {
      throw new Error('Recipient not found');
    }
    
    recipients[index] = recipient;
    
    await Preferences.set({
      key: RECIPIENTS_STORAGE_KEY,
      value: JSON.stringify(recipients),
    });
    
    if (isOffline) {
      // Queue the API update for when connection is restored
      addPausedRequest(async () => {
        try {
          return await apiService.recipients.update(recipient.id, recipient);
        } catch (error) {
          console.error('Failed to sync recipient update:', error);
          throw error;
        }
      });
      
      return recipient;
    }
    
    // Send to API if online
    try {
      return await apiService.recipients.update(recipient.id, recipient);
    } catch (error) {
      console.error('Error updating recipient via API:', error);
      return recipient; // Return the locally updated recipient on API error
    }
  } catch (error) {
    console.error('Error updating recipient in storage:', error);
    throw new Error('Failed to update recipient');
  }
};

// Delete a recipient
export const deleteRecipient = async (id: string): Promise<void> => {
  const { isOffline, addPausedRequest } = useNetwork();
  
  // Remove from local storage first
  try {
    const recipients = await getRecipients();
    const filteredRecipients = recipients.filter(r => r.id !== id);
    
    await Preferences.set({
      key: RECIPIENTS_STORAGE_KEY,
      value: JSON.stringify(filteredRecipients),
    });
    
    if (isOffline) {
      // Queue the API delete for when connection is restored
      addPausedRequest(async () => {
        try {
          await apiService.recipients.delete(id);
        } catch (error) {
          console.error('Failed to sync recipient deletion:', error);
          throw error;
        }
      });
      
      return;
    }
    
    // Send to API if online
    try {
      await apiService.recipients.delete(id);
    } catch (error) {
      console.error('Error deleting recipient via API:', error);
      // No need to throw, we've already deleted it locally
    }
  } catch (error) {
    console.error('Error deleting recipient from storage:', error);
    throw new Error('Failed to delete recipient');
  }
};

// Toggle favorite status
export const toggleFavorite = async (id: string): Promise<Recipient> => {
  const recipients = await getRecipients();
  const index = recipients.findIndex(r => r.id === id);
  
  if (index === -1) {
    throw new Error('Recipient not found');
  }
  
  const updatedRecipient = {
    ...recipients[index],
    isFavorite: !recipients[index].isFavorite
  };
  
  return updateRecipient(updatedRecipient);
};

// Update last used timestamp
export const updateLastUsed = async (id: string): Promise<Recipient> => {
  const recipients = await getRecipients();
  const index = recipients.findIndex(r => r.id === id);
  
  if (index === -1) {
    throw new Error('Recipient not found');
  }
  
  const updatedRecipient = {
    ...recipients[index],
    lastUsed: new Date()
  };
  
  return updateRecipient(updatedRecipient);
};
