
import React from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Contact } from '@/services/contacts';
import { Users } from 'lucide-react';

interface ContactsListProps {
  contacts: Contact[];
  selectedContacts: Set<string>;
  toggleContact: (id: string) => void;
  isPlatform: (platform: string) => boolean;
}

const ContactsList: React.FC<ContactsListProps> = ({
  contacts,
  selectedContacts,
  toggleContact,
  isPlatform,
}) => {
  if (contacts.length === 0) {
    return (
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
    );
  }

  return (
    <ScrollArea className="h-[50vh] pr-4">
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
    </ScrollArea>
  );
};

export default ContactsList;
