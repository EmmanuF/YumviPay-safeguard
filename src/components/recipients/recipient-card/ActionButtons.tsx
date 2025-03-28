
import React from 'react';
import { Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onEdit, onDelete }) => {
  if (!onEdit && !onDelete) return null;
  
  return (
    <div className="flex justify-end gap-2 mt-3">
      {onEdit && (
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={onEdit}
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
          onClick={onDelete}
        >
          <Trash className="h-3.5 w-3.5 mr-1" />
          Delete
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
