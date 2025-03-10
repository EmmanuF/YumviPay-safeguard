
import { Recipient } from '@/types/recipient';
import { Preferences } from '@capacitor/preferences';
import { supabase } from '@/integrations/supabase/client';
import { isOffline as checkIsOffline, addPausedRequest as queueRequest } from '@/utils/networkUtils';
import { RECIPIENTS_STORAGE_KEY } from './constants';
import { getUserId } from './utils';
import { getRecipients } from './recipientsFetch';

// Add a new recipient
export const addRecipient = async (recipient: Omit<Recipient, 'id'>): Promise<Recipient> => {
  const isOffline = checkIsOffline();
  
  if (isOffline) {
    // Create a temporary ID for offline mode
    const tempRecipient: Recipient = {
      ...recipient,
      id: `temp_${Date.now()}`,
      lastUsed: new Date()
    };
    
    // Store locally
    const recipients = await getRecipients();
    await Preferences.set({
      key: RECIPIENTS_STORAGE_KEY,
      value: JSON.stringify([...recipients, tempRecipient]),
    });
    
    // Queue Supabase insert for when connection is restored
    queueRequest(async () => {
      try {
        const userId = await getUserId();
        if (!userId) throw new Error('User not authenticated');
        
        const { data, error } = await supabase
          .from('recipients')
          .insert({
            user_id: userId,
            name: recipient.name,
            contact: recipient.contact,
            country: recipient.country,
            is_favorite: recipient.isFavorite,
            last_used: new Date().toISOString()
          })
          .select()
          .single();
          
        if (error) throw error;
        
        // Update the local storage by replacing temp ID with the new one
        const updatedRecipients = await getRecipients();
        const finalRecipients = updatedRecipients.map(r => 
          r.id === tempRecipient.id 
            ? { ...r, id: data.id } 
            : r
        );
        
        await Preferences.set({
          key: RECIPIENTS_STORAGE_KEY,
          value: JSON.stringify(finalRecipients),
        });
        
        return data;
      } catch (error) {
        console.error('Failed to sync new recipient:', error);
        throw error;
      }
    });
    
    return tempRecipient;
  }
  
  // Online mode: Insert into Supabase
  try {
    const userId = await getUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('recipients')
      .insert({
        user_id: userId,
        name: recipient.name,
        contact: recipient.contact,
        country: recipient.country,
        is_favorite: recipient.isFavorite,
        last_used: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    
    const newRecipient: Recipient = {
      id: data.id,
      name: data.name,
      contact: data.contact,
      country: data.country,
      isFavorite: data.is_favorite,
      lastUsed: new Date(data.last_used)
    };
    
    // Update local cache
    const recipients = await getRecipients();
    await Preferences.set({
      key: RECIPIENTS_STORAGE_KEY,
      value: JSON.stringify([...recipients, newRecipient]),
    });
    
    return newRecipient;
  } catch (error) {
    console.error('Error adding recipient via Supabase:', error);
    
    // Fallback to local storage on error
    const tempRecipient: Recipient = {
      ...recipient,
      id: `error_${Date.now()}`,
      lastUsed: new Date()
    };
    
    const recipients = await getRecipients();
    await Preferences.set({
      key: RECIPIENTS_STORAGE_KEY,
      value: JSON.stringify([...recipients, tempRecipient]),
    });
    
    return tempRecipient;
  }
};
