
import { Recipient } from '@/types/recipient';
import { Preferences } from '@capacitor/preferences';
import { supabase } from '@/integrations/supabase/client';
import { isOffline as checkIsOffline } from '@/utils/networkUtils';
import { RECIPIENTS_STORAGE_KEY } from './constants';
import { getUserId } from './utils';

// Get all recipients from Supabase or local storage
export const getRecipients = async (): Promise<Recipient[]> => {
  const isOffline = checkIsOffline();
  
  // Try to get from Supabase first if online
  if (!isOffline) {
    try {
      const userId = await getUserId();
      if (!userId) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('recipients')
        .select('*')
        .eq('user_id', userId)
        .order('last_used', { ascending: false });
        
      if (error) throw error;
      
      const recipients = data.map((row) => ({
        id: row.id,
        name: row.name,
        contact: row.contact,
        country: row.country,
        isFavorite: row.is_favorite,
        lastUsed: new Date(row.last_used)
      }));
      
      // Cache the recipients for offline use
      await Preferences.set({
        key: RECIPIENTS_STORAGE_KEY,
        value: JSON.stringify(recipients),
      });
      
      return recipients;
    } catch (error) {
      console.error('Error fetching recipients from Supabase:', error);
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
