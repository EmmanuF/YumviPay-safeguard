
import React from 'react';
import { motion } from 'framer-motion';
import { Recipient } from '@/types/recipient';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import RecipientAvatar from './RecipientAvatar';
import RecipientInfo from './RecipientInfo';
import FavoriteButton from './FavoriteButton';
import ActionButtons from './ActionButtons';

interface RecipientCardProps {
  recipient: Recipient;
  onSelect?: (recipient: Recipient) => void;
  onEdit?: (recipient: Recipient) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

const RecipientCard: React.FC<RecipientCardProps> = ({
  recipient,
  onSelect,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(recipient.id);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(recipient);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(recipient.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "border border-gray-200 transition-all duration-200 cursor-pointer",
          onSelect && "hover:border-primary-200 hover:shadow-md"
        )}
        onClick={() => onSelect && onSelect(recipient)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <RecipientAvatar name={recipient.name} className="mr-3" />
              <RecipientInfo 
                name={recipient.name} 
                contact={recipient.contact} 
              />
            </div>
            
            {onToggleFavorite && (
              <FavoriteButton 
                isFavorite={recipient.isFavorite}
                onClick={handleFavoriteClick}
              />
            )}
          </div>
          
          <ActionButtons 
            onEdit={onEdit ? handleEditClick : undefined}
            onDelete={onDelete ? handleDeleteClick : undefined}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecipientCard;
