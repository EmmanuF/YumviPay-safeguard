
import React, { useState } from 'react';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Contact } from '@/services/contacts';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ContactsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contacts: Contact[];
  isLoading: boolean;
  onSelect: (contact: Contact) => void;
}

const ContactsDialog: React.FC<ContactsDialogProps> = ({
  open,
  onOpenChange,
  contacts,
  isLoading,
  onSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (contact.phoneNumber && contact.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-center">Select a Contact</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4">
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ScrollArea className="max-h-[50vh] pr-4">
            {filteredContacts.length > 0 ? (
              <div className="space-y-3">
                {filteredContacts.map((contact) => (
                  <motion.div
                    key={contact.id}
                    className="p-3 border border-gray-100 rounded-lg hover:bg-primary-50 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect(contact)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary-100 rounded-full p-2">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        {contact.phoneNumber && (
                          <p className="text-sm text-gray-500">{contact.phoneNumber}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8">
                <p className="text-gray-500">No contacts found</p>
              </div>
            )}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactsDialog;
