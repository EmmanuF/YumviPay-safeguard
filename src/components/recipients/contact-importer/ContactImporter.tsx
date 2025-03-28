
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Contact } from '@/services/contacts';
import { isPlatform } from '@/utils/platformUtils';
import ContactsImportButton from './ContactsImportButton';
import ContactsDialogContent from './ContactsDialogContent';
import { useContactImporter } from './useContactImporter';

interface ContactImporterProps {
  onImport: (contacts: Pick<Contact, 'name' | 'phoneNumber' | 'email'>[]) => void;
}

const ContactImporter: React.FC<ContactImporterProps> = ({ onImport }) => {
  const {
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
  } = useContactImporter({ onImport });

  return (
    <>
      <ContactsImportButton onClick={handleOpen} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import from Contacts</DialogTitle>
            <DialogDescription>
              Select contacts to add as recipients
            </DialogDescription>
          </DialogHeader>
          
          <ContactsDialogContent
            loading={loading}
            contacts={contacts}
            selectedContacts={selectedContacts}
            toggleContact={toggleContact}
            selectAll={selectAll}
            deselectAll={deselectAll}
            isPlatform={isPlatform}
            handleImport={handleImport}
            setOpen={setOpen}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactImporter;
