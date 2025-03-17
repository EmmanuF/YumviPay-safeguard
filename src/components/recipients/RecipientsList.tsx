
import React from 'react';
import { Recipient } from '@/types/recipient';
import RecipientCard from './RecipientCard';
import { UserPlus } from 'lucide-react';

interface RecipientsListProps {
  recipients: Recipient[];
  loading: boolean;
  searchQuery: string;
  activeTab: string;
  onSelectRecipient: (recipient: Recipient) => void;
  onEditRecipient: (recipient: Recipient) => void;
  onDeleteRecipient: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const RecipientsList: React.FC<RecipientsListProps> = ({
  recipients,
  loading,
  searchQuery,
  activeTab,
  onSelectRecipient,
  onEditRecipient,
  onDeleteRecipient,
  onToggleFavorite,
}) => {
  if (loading) {
    return <div className="py-10 text-center text-gray-500">Loading recipients...</div>;
  }

  if (recipients.length === 0) {
    return (
      <div className="py-10 text-center">
        <div className="bg-gray-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-3">
          <UserPlus className="h-7 w-7 text-gray-400" />
        </div>
        <h3 className="text-gray-700 font-medium">No recipients found</h3>
        <p className="text-gray-500 text-sm mt-1">
          {searchQuery 
            ? "Try a different search query" 
            : activeTab === 'favorites'
              ? "You don't have any favorite recipients yet"
              : "Add your first recipient to get started"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recipients.map((recipient) => (
        <RecipientCard
          key={recipient.id}
          recipient={recipient}
          onSelect={onSelectRecipient}
          onEdit={onEditRecipient}
          onDelete={onDeleteRecipient}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

export default RecipientsList;
