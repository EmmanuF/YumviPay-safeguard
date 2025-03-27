
import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContactsButtonProps {
  onClick: () => void;
}

const ContactsButton: React.FC<ContactsButtonProps> = ({ onClick }) => {
  return (
    <motion.div 
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { 
          y: 0, 
          opacity: 1,
          transition: { type: 'spring', stiffness: 300, damping: 24 }
        }
      }}
      className="mb-6 flex justify-center"
    >
      <Button 
        variant="outline" 
        onClick={onClick}
        className="flex items-center gap-2 w-full mb-4 border-2 border-primary-200 bg-white shadow-sm py-6 hover:bg-primary-50 hover:border-primary-300 text-primary-700"
        size="lg"
      >
        <Users className="h-5 w-5 text-primary-500" />
        <span className="font-medium">Select from Contacts</span>
      </Button>
    </motion.div>
  );
};

export default ContactsButton;
