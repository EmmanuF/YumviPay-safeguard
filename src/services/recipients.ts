
import { Recipient } from '@/types/recipient';
import { Preferences } from '@capacitor/preferences';

const RECIPIENTS_STORAGE_KEY = 'yumvi_recipients';

// Get all recipients from storage
export const getRecipients = async (): Promise<Recipient[]> => {
  try {
    const { value } = await Preferences.get({ key: RECIPIENTS_STORAGE_KEY });
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('Error getting recipients:', error);
    return [];
  }
};

// Add a new recipient
export const addRecipient = async (recipient: Omit<Recipient, 'id'>): Promise<Recipient> => {
  try {
    const recipients = await getRecipients();
    
    const newRecipient: Recipient = {
      ...recipient,
      id: `recipient_${Date.now()}`,
      lastUsed: new Date(),
    };
    
    const updatedRecipients = [...recipients, newRecipient];
    await Preferences.set({
      key: RECIPIENTS_STORAGE_KEY,
      value: JSON.stringify(updatedRecipients),
    });
    
    return newRecipient;
  } catch (error) {
    console.error('Error adding recipient:', error);
    throw new Error('Failed to add recipient');
  }
};

// Update an existing recipient
export const updateRecipient = async (recipient: Recipient): Promise<Recipient> => {
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
    
    return recipient;
  } catch (error) {
    console.error('Error updating recipient:', error);
    throw new Error('Failed to update recipient');
  }
};

// Delete a recipient
export const deleteRecipient = async (id: string): Promise<void> => {
  try {
    const recipients = await getRecipients();
    const filteredRecipients = recipients.filter(r => r.id !== id);
    
    await Preferences.set({
      key: RECIPIENTS_STORAGE_KEY,
      value: JSON.stringify(filteredRecipients),
    });
  } catch (error) {
    console.error('Error deleting recipient:', error);
    throw new Error('Failed to delete recipient');
  }
};

// Toggle favorite status
export const toggleFavorite = async (id: string): Promise<Recipient> => {
  try {
    const recipients = await getRecipients();
    const index = recipients.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error('Recipient not found');
    }
    
    recipients[index] = {
      ...recipients[index],
      isFavorite: !recipients[index].isFavorite
    };
    
    await Preferences.set({
      key: RECIPIENTS_STORAGE_KEY,
      value: JSON.stringify(recipients),
    });
    
    return recipients[index];
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw new Error('Failed to update recipient');
  }
};

// Update last used timestamp
export const updateLastUsed = async (id: string): Promise<Recipient> => {
  try {
    const recipients = await getRecipients();
    const index = recipients.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error('Recipient not found');
    }
    
    recipients[index] = {
      ...recipients[index],
      lastUsed: new Date()
    };
    
    await Preferences.set({
      key: RECIPIENTS_STORAGE_KEY,
      value: JSON.stringify(recipients),
    });
    
    return recipients[index];
  } catch (error) {
    console.error('Error updating last used:', error);
    throw new Error('Failed to update recipient');
  }
};
