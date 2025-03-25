
import React, { createContext, useContext, ReactNode } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Recipient } from '@/types/recipient';
import { 
  getRecipients, 
  addRecipient, 
  updateRecipient, 
  deleteRecipient, 
  toggleFavorite, 
  updateLastUsed 
} from '@/services/recipients/index';
import { useToast } from '@/hooks/use-toast';

// Define the return type for the hook
interface RecipientsContextType {
  recipients: Recipient[];
  loading: boolean;
  addRecipient: (recipient: Omit<Recipient, 'id'>) => Promise<Recipient>;
  updateRecipient: (recipient: Recipient) => Promise<Recipient>;
  deleteRecipient: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<Recipient>;
  updateLastUsed: (id: string) => Promise<Recipient>;
  refreshRecipients: () => Promise<void>;
}

// Create context
const RecipientsContext = createContext<RecipientsContextType | undefined>(undefined);

// Provider component
export const RecipientsProvider = ({ children }: { children: ReactNode }) => {
  const recipientsData = useRecipientsCore();
  
  return (
    <RecipientsContext.Provider value={recipientsData}>
      {children}
    </RecipientsContext.Provider>
  );
};

// Core hook implementation
const useRecipientsCore = (): RecipientsContextType => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load recipients
  const fetchRecipients = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getRecipients();
      setRecipients(data);
    } catch (error) {
      console.error('Error fetching recipients:', error);
      toast({
        title: 'Error',
        description: 'Failed to load recipients',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load recipients on mount
  useEffect(() => {
    fetchRecipients();
  }, [fetchRecipients]);

  // Add a new recipient
  const handleAddRecipient = async (recipient: Omit<Recipient, 'id'>) => {
    try {
      const newRecipient = await addRecipient(recipient);
      setRecipients((prev) => [...prev, newRecipient]);
      toast({
        title: 'Success',
        description: 'Recipient added successfully',
      });
      return newRecipient;
    } catch (error) {
      console.error('Error adding recipient:', error);
      toast({
        title: 'Error',
        description: 'Failed to add recipient',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Update an existing recipient
  const handleUpdateRecipient = async (recipient: Recipient) => {
    try {
      const updatedRecipient = await updateRecipient(recipient);
      setRecipients((prev) =>
        prev.map((r) => (r.id === recipient.id ? updatedRecipient : r))
      );
      toast({
        title: 'Success',
        description: 'Recipient updated successfully',
      });
      return updatedRecipient;
    } catch (error) {
      console.error('Error updating recipient:', error);
      toast({
        title: 'Error',
        description: 'Failed to update recipient',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Delete a recipient
  const handleDeleteRecipient = async (id: string) => {
    try {
      await deleteRecipient(id);
      setRecipients((prev) => prev.filter((r) => r.id !== id));
      toast({
        title: 'Success',
        description: 'Recipient deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting recipient:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete recipient',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Toggle favorite status
  const handleToggleFavorite = async (id: string) => {
    try {
      const updatedRecipient = await toggleFavorite(id);
      setRecipients((prev) =>
        prev.map((r) => (r.id === id ? updatedRecipient : r))
      );
      return updatedRecipient;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to update recipient',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Update last used timestamp
  const handleUpdateLastUsed = async (id: string) => {
    try {
      const updatedRecipient = await updateLastUsed(id);
      setRecipients((prev) =>
        prev.map((r) => (r.id === id ? updatedRecipient : r))
      );
      return updatedRecipient;
    } catch (error) {
      console.error('Error updating last used:', error);
      toast({
        title: 'Error',
        description: 'Failed to update last used',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    recipients,
    loading,
    addRecipient: handleAddRecipient,
    updateRecipient: handleUpdateRecipient,
    deleteRecipient: handleDeleteRecipient,
    toggleFavorite: handleToggleFavorite,
    updateLastUsed: handleUpdateLastUsed,
    refreshRecipients: fetchRecipients,
  };
};

// Export the hook with context
export const useRecipients = () => {
  const context = useContext(RecipientsContext);
  
  // If outside provider, use the core hook directly
  if (context === undefined) {
    return useRecipientsCore();
  }
  
  return context;
};
