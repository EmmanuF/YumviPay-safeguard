
import React from 'react';
import { motion } from 'framer-motion';
import { Recipient } from '@/types/recipient';
import { Star, Edit, Trash, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-primary-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{recipient.name}</h3>
                <p className="text-sm text-gray-500">{recipient.contact}</p>
              </div>
            </div>
            
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(recipient.id);
                }}
                className="h-8 w-8"
              >
                <Star
                  className={cn(
                    "h-4 w-4",
                    recipient.isFavorite
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-400"
                  )}
                />
              </Button>
            )}
          </div>
          
          {(onEdit || onDelete) && (
            <div className="flex justify-end gap-2 mt-3">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(recipient);
                  }}
                >
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
              )}
              
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-red-200 text-red-500 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(recipient.id);
                  }}
                >
                  <Trash className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecipientCard;
