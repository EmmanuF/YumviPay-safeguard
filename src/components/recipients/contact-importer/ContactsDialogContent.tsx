
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Contact } from '@/services/contacts';
import ContactsList from './ContactsList';

interface ContactsDialogContentProps {
  loading: boolean;
  contacts: Contact[];
  selectedContacts: Set<string>;
  toggleContact: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  isPlatform: (platform: string) => boolean;
  handleImport: () => void;
  setOpen: (open: boolean) => void;
}

const ContactsDialogContent: React.FC<ContactsDialogContentProps> = ({
  loading,
  contacts,
  selectedContacts,
  toggleContact,
  selectAll,
  deselectAll,
  isPlatform,
  handleImport,
  setOpen,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <span className="text-muted-foreground">Loading contacts...</span>
      </div>
    );
  }

  return (
    <>
      {isPlatform('native') && (
        <div className="bg-amber-50 p-3 rounded-md mb-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              On a real device, this would access your actual contacts. For this demo, we're displaying sample contacts.
            </p>
          </div>
        </div>
      )}
      
      {contacts.length > 0 && (
        <div className="flex justify-between mb-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={selectAll}
            disabled={selectedContacts.size === contacts.length}
          >
            Select all
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={deselectAll}
            disabled={selectedContacts.size === 0}
          >
            Deselect all
          </Button>
        </div>
      )}
    
      <ContactsList 
        contacts={contacts} 
        selectedContacts={selectedContacts} 
        toggleContact={toggleContact}
        isPlatform={isPlatform}
      />
      
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button 
          onClick={handleImport}
          disabled={selectedContacts.size === 0}
        >
          Import Selected ({selectedContacts.size})
        </Button>
      </div>
    </>
  );
};

export default ContactsDialogContent;
