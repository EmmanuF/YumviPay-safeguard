
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { importContacts, Contact } from '@/services/contacts';
import { Loader2, Users } from 'lucide-react';

interface ContactImporterProps {
  onImport: (contacts: Pick<Contact, 'name' | 'phoneNumber' | 'email'>[]) => void;
}

const ContactImporter: React.FC<ContactImporterProps> = ({ onImport }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());

  const handleOpen = async () => {
    setOpen(true);
    setLoading(true);
    
    try {
      const importedContacts = await importContacts();
      setContacts(importedContacts);
    } catch (error) {
      console.error('Failed to import contacts:', error);
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
  };

  const handleImport = () => {
    const selectedContactsData = contacts
      .filter(contact => selectedContacts.has(contact.id))
      .map(({ name, phoneNumber, email }) => ({ name, phoneNumber, email }));
    
    onImport(selectedContactsData);
    setOpen(false);
    setSelectedContacts(new Set());
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={handleOpen} 
        className="flex items-center justify-center gap-2"
      >
        <Users className="h-4 w-4" />
        Import from Contacts
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import from Contacts</DialogTitle>
          </DialogHeader>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading contacts...</span>
            </div>
          ) : (
            <>
              <ScrollArea className="h-[50vh] pr-4">
                {contacts.length > 0 ? (
                  <div className="space-y-4">
                    {contacts.map((contact) => (
                      <div 
                        key={contact.id} 
                        className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted"
                      >
                        <Checkbox 
                          id={`contact-${contact.id}`}
                          checked={selectedContacts.has(contact.id)}
                          onCheckedChange={() => toggleContact(contact.id)}
                        />
                        <div className="grid gap-1">
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
                    <p>No contacts found</p>
                  </div>
                )}
              </ScrollArea>
              
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
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactImporter;
