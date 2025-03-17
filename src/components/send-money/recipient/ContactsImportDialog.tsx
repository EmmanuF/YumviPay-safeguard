
import React, { useState } from 'react';
import { Loader2, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Contact, importContacts } from '@/services/contacts';

interface ContactsImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectContact: (contact: Contact) => void;
}

const ContactsImportDialog: React.FC<ContactsImportDialogProps> = ({
  open,
  onOpenChange,
  onSelectContact,
}) => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [loadingContacts, setLoadingContacts] = useState(false);

  React.useEffect(() => {
    if (open && contacts.length === 0) {
      loadContacts();
    }
  }, [open]);

  const loadContacts = async () => {
    setLoadingContacts(true);
    try {
      const importedContacts = await importContacts();
      setContacts(importedContacts);
    } catch (error) {
      console.error('Failed to import contacts:', error);
      toast({
        title: "Import failed",
        description: "Could not access your contacts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingContacts(false);
    }
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact === selectedContact ? null : contact);
  };

  const handleImportContact = () => {
    if (!selectedContact) {
      toast({
        title: "No contact selected",
        description: "Please select a contact to import",
        variant: "destructive"
      });
      return;
    }

    onSelectContact(selectedContact);
    onOpenChange(false);
    setSelectedContact(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import from Contacts</DialogTitle>
        </DialogHeader>
        
        {loadingContacts ? (
          <div className="flex flex-col justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <span className="text-muted-foreground">Loading contacts...</span>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[50vh] pr-4">
              {contacts.length > 0 ? (
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div 
                      key={contact.id} 
                      className={`flex items-start space-x-3 p-3 rounded-md cursor-pointer ${
                        selectedContact?.id === contact.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted'
                      }`}
                      onClick={() => handleSelectContact(contact)}
                    >
                      <Checkbox 
                        id={`contact-${contact.id}`}
                        checked={selectedContact?.id === contact.id}
                        onCheckedChange={() => handleSelectContact(contact)}
                        className="mt-1"
                      />
                      <div className="grid gap-1 text-left">
                        <label 
                          htmlFor={`contact-${contact.id}`}
                          className="font-medium cursor-pointer"
                        >
                          {contact.name}
                        </label>
                        {contact.phoneNumber && (
                          <p className="text-sm text-muted-foreground">
                            {contact.phoneNumber}
                          </p>
                        )}
                        {contact.email && (
                          <p className="text-sm text-muted-foreground">
                            {contact.email}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium mb-1">No contacts found</p>
                  <p className="text-sm text-muted-foreground">
                    Please add contacts to your device or grant permission to access them
                  </p>
                </div>
              )}
            </ScrollArea>
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleImportContact}
                disabled={!selectedContact}
              >
                Import Selected Contact
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactsImportDialog;
