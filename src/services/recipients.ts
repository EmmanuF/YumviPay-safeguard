
import { Recipient } from '@/types/recipient';
import { Preferences } from '@capacitor/preferences';
import { supabase } from '@/integrations/supabase/client';
import { useNetwork } from '@/contexts/NetworkContext';

const RECIPIENTS_STORAGE_KEY = 'yumvi_recipients';

// Get all recipients from Supabase or local storage
export const getRecipients = async (): Promise<Recipient[]> => {
  const { isOffline } = useNetwork();
  
  // Try to get from Supabase first if online
  if (!isOffline) {
    try {
      const { data, error } = await supabase
        .from('recipients')
        .select('*')
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

// Add a new recipient
export const addRecipient = async (recipient: Omit<Recipient, 'id'>): Promise<Recipient> => {
  const { isOffline, addPausedRequest } = useNetwork();
  
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
    addPausedRequest(async () => {
      try {
        const { data, error } = await supabase
          .from('recipients')
          .insert({
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
    const { data, error } = await supabase
      .from('recipients')
      .insert({
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
      // Queue Supabase update for when connection is restored
      addPausedRequest(async () => {
        try {
          // Only update Supabase if this isn't a temporary ID
          if (!recipient.id.startsWith('temp_') && !recipient.id.startsWith('error_')) {
            const { error } = await supabase
              .from('recipients')
              .update({
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
        const { error } = await supabase
          .from('recipients')
          .update({
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
      // Queue Supabase delete for when connection is restored
      addPausedRequest(async () => {
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
