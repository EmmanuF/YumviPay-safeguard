
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { importContacts, Contact } from '@/services/contacts';
import { Loader2, Users, AlertTriangle } from 'lucide-react';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';
import { toast } from '@/hooks/use-toast';
import { isPlatform } from '@/utils/platformUtils';
import { motion } from 'framer-motion';

interface ContactImporterProps {
  onImport: (contacts: Pick<Contact, 'name' | 'phoneNumber' | 'email'>[]) => void;
}

const ContactImporter: React.FC<ContactImporterProps> = ({ onImport }) => {
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
      
      if (importedContacts.length === 0 && isPlatform('capacitor')) {
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

  return (
    <>
      <Button 
        variant="outline" 
        onClick={handleOpen} 
        className="flex items-center justify-center gap-2 w-full md:w-auto"
      >
        <Users className="h-4 w-4" />
        Import from Contacts
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import from Contacts</DialogTitle>
            <DialogDescription>
              Select contacts to add as recipients
            </DialogDescription>
          </DialogHeader>
          
          {isPlatform('capacitor') && (
            <div className="bg-amber-50 p-3 rounded-md mb-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  On a real device, this would access your actual contacts. For this demo, we're displaying sample contacts.
                </p>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="flex flex-col justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <span className="text-muted-foreground">Loading contacts...</span>
            </div>
          ) : (
            <>
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
            
              <ScrollArea className="h-[50vh] pr-4">
                {contacts.length > 0 ? (
                  <div className="space-y-4">
                    {contacts.map((contact) => (
                      <motion.div 
                        key={contact.id} 
                        className="flex items-start space-x-3 p-3 rounded-md hover:bg-muted"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => toggleContact(contact.id)}
                      >
                        <Checkbox 
                          id={`contact-${contact.id}`}
                          checked={selectedContacts.has(contact.id)}
                          onCheckedChange={() => toggleContact(contact.id)}
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
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium mb-1">No contacts found</p>
                    <p className="text-sm text-muted-foreground">
                      {isPlatform('native') 
                        ? "Please add contacts to your device or grant permission to access them"
                        : "No contacts available in demo mode"}
                    </p>
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
