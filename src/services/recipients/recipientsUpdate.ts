
import { Recipient } from '@/types/recipient';
import { Preferences } from '@capacitor/preferences';
import { supabase } from '@/integrations/supabase/client';
import { isOffline as checkIsOffline, addPausedRequest as queueRequest } from '@/utils/networkUtils';
import { RECIPIENTS_STORAGE_KEY } from './constants';
import { getUserId } from './utils';
import { getRecipients } from './recipientsFetch';

// Update an existing recipient
export const updateRecipient = async (recipient: Recipient): Promise<Recipient> => {
  const isOffline = checkIsOffline();
  
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
      // Queue Supabase update for when connection is restored
      queueRequest(async () => {
        try {
          // Only update Supabase if this isn't a temporary ID
          if (!recipient.id.startsWith('temp_') && !recipient.id.startsWith('error_')) {
            const userId = await getUserId();
            if (!userId) throw new Error('User not authenticated');
            
            const { error } = await supabase
              .from('recipients')
              .update({
                user_id: userId,
                name: recipient.name,
                contact: recipient.contact,
                country: recipient.country,
                is_favorite: recipient.isFavorite,
                last_used: recipient.lastUsed.toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('id', recipient.id);
              
            if (error) throw error;
          }
          return recipient;
        } catch (error) {
          console.error('Failed to sync recipient update:', error);
          throw error;
        }
      });
      
      return recipient;
    }
    
    // Online mode: Update in Supabase
    try {
      // Only update Supabase if this isn't a temporary ID
      if (!recipient.id.startsWith('temp_') && !recipient.id.startsWith('error_')) {
        const userId = await getUserId();
        if (!userId) throw new Error('User not authenticated');
        
        const { error } = await supabase
          .from('recipients')
          .update({
            user_id: userId,
            name: recipient.name,
            contact: recipient.contact,
            country: recipient.country,
            is_favorite: recipient.isFavorite,
            last_used: recipient.lastUsed.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', recipient.id);
          
        if (error) throw error;
      }
      
      return recipient;
    } catch (error) {
      console.error('Error updating recipient via Supabase:', error);
      return recipient; // Still return the locally updated recipient
    }
  } catch (error) {
    console.error('Error updating recipient in storage:', error);
    throw new Error('Failed to update recipient');
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
