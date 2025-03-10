
import { Preferences } from '@capacitor/preferences';
import { supabase } from '@/integrations/supabase/client';
import { isOffline as checkIsOffline, addPausedRequest as queueRequest } from '@/utils/networkUtils';
import { RECIPIENTS_STORAGE_KEY } from './constants';
import { getRecipients } from './recipientsFetch';

// Delete a recipient
export const deleteRecipient = async (id: string): Promise<void> => {
  const isOffline = checkIsOffline();
  
  // Remove from local storage first
  try {
    const recipients = await getRecipients();
    const filteredRecipients = recipients.filter(r => r.id !== id);
    
    await Preferences.set({
      key: RECIPIENTS_STORAGE_KEY,
      value: JSON.stringify(filteredRecipients),
    });
    
    if (isOffline) {
      // Queue Supabase delete for when connection is restored
      queueRequest(async () => {
        try {
          // Only delete from Supabase if this isn't a temporary ID
          if (!id.startsWith('temp_') && !id.startsWith('error_')) {
            const { error } = await supabase
              .from('recipients')
              .delete()
              .eq('id', id);
              
            if (error) throw error;
          }
        } catch (error) {
          console.error('Failed to sync recipient deletion:', error);
          throw error;
        }
      });
      
      return;
    }
    
    // Online mode: Delete from Supabase
    try {
      // Only delete from Supabase if this isn't a temporary ID
      if (!id.startsWith('temp_') && !id.startsWith('error_')) {
        const { error } = await supabase
          .from('recipients')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error deleting recipient via Supabase:', error);
      // Already deleted locally, so no need to throw
    }
  } catch (error) {
    console.error('Error deleting recipient from storage:', error);
    throw new Error('Failed to delete recipient');
  }
};
