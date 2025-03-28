
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface ContactsImportButtonProps {
  onClick: () => void;
  className?: string;
}

const ContactsImportButton: React.FC<ContactsImportButtonProps> = ({ onClick, className }) => {
  return (
    <Button 
      variant="outline" 
      onClick={onClick} 
      className={`flex items-center justify-center gap-2 w-full md:w-auto ${className || ''}`}
    >
      <Users className="h-4 w-4" />
      Import from Contacts
    </Button>
  );
};

export default ContactsImportButton;
