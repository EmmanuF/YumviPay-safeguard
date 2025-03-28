
import { useState } from 'react';
import { importContacts, Contact } from '@/services/contacts';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';
import { toast } from '@/hooks/use-toast';
import { isPlatform } from '@/utils/platformUtils';

export interface UseContactImporterOptions {
  onImport: (contacts: Pick<Contact, 'name' | 'phoneNumber' | 'email'>[]) => void;
}

export const useContactImporter = ({ onImport }: UseContactImporterOptions) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const { isNative, triggerHapticFeedback } = useDeviceCapabilities();

  const handleOpen = async () => {
    setOpen(true);
    setLoading(true);
    
    // Provide haptic feedback if on a native device
    if (isNative) {
      triggerHapticFeedback();
    }
    
    try {
      const importedContacts = await importContacts();
      setContacts(importedContacts);
      
      if (importedContacts.length === 0 && isPlatform('native')) {
        toast({
          title: "No contacts found",
          description: "Please grant contacts permission or add contacts to your device",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to import contacts:', error);
      toast({
        title: "Import failed",
        description: "Could not access your contacts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleContact = (id: string) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedContacts(newSelected);
    
    // Provide haptic feedback if on a native device
    if (isNative) {
      triggerHapticFeedback();
    }
  };

  const handleImport = () => {
    const selectedContactsData = contacts
      .filter(contact => selectedContacts.has(contact.id))
      .map(({ name, phoneNumber, email }) => ({ name, phoneNumber, email }));
    
    onImport(selectedContactsData);
    
    toast({
      title: "Contacts imported",
      description: `Successfully imported ${selectedContactsData.length} contacts`,
    });
    
    setOpen(false);
    setSelectedContacts(new Set());
  };

  const selectAll = () => {
    const allIds = contacts.map(contact => contact.id);
    setSelectedContacts(new Set(allIds));
  };

  const deselectAll = () => {
    setSelectedContacts(new Set());
  };

  return {
    open,
    setOpen,
    loading,
    contacts,
    selectedContacts,
    toggleContact,
    handleOpen,
    handleImport,
    selectAll,
    deselectAll
  };
};
