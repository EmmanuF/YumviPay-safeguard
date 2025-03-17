
import React from 'react';
import { Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Recipient } from '@/types/recipient';

interface RecipientCardProps {
  recipient: Recipient;
  isSelected: boolean;
  onSelect: (contact: string, name: string, id: string, country?: string) => void;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
}

const RecipientCard: React.FC<RecipientCardProps> = ({
  recipient,
  isSelected,
  onSelect,
  onToggleFavorite,
}) => {
  return (
    <Card 
      key={recipient.id}
      className={`p-3 cursor-pointer transition-all ${
        isSelected ? 
        'border-primary bg-primary/5' : 'hover:border-gray-300'
      }`}
      onClick={() => onSelect(recipient.contact, recipient.name, recipient.id, recipient.country)}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-primary/10 text-primary">
            <span>{recipient.name[0]}</span>
          </Avatar>
          <div>
            <h4 className="font-medium">{recipient.name}</h4>
            <p className="text-sm text-gray-500">{recipient.contact}</p>
          </div>
        </div>
        <Star 
          className={`h-5 w-5 ${recipient.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          onClick={(e) => onToggleFavorite(e, recipient.id)}
        />
      </div>
    </Card>
  );
};

export default RecipientCard;
