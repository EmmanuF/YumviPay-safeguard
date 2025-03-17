
import React from 'react';
import { motion } from 'framer-motion';
import RecipientCard from './RecipientCard';
import { Recipient } from '@/types/recipient';

interface RecipientsListProps {
  recipients: Recipient[];
  loading: boolean;
  selectedRecipient: string | null;
  onSelectRecipient: (contact: string, name: string, recipientId: string, country?: string) => void;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
}

const RecipientsList: React.FC<RecipientsListProps> = ({
  recipients,
  loading,
  selectedRecipient,
  onSelectRecipient,
  onToggleFavorite,
}) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading recipients...</div>;
  }

  if (recipients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No recipients found in this category.
      </div>
    );
  }

  return (
    <motion.div variants={itemVariants} className="space-y-2">
      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
        {recipients.map((recipient) => (
          <RecipientCard
            key={recipient.id}
            recipient={recipient}
            isSelected={selectedRecipient === recipient.contact}
            onSelect={onSelectRecipient}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default RecipientsList;
