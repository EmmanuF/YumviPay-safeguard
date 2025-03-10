
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  field: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  open,
  onOpenChange,
  field,
  value,
  onChange,
  onSave,
}) => {
  const fieldDisplayName = field ? field.charAt(0).toUpperCase() + field.slice(1) : '';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {fieldDisplayName}</DialogTitle>
          <DialogDescription>
            Update your {field} information below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Label htmlFor="edit-field" className="text-right">
            {fieldDisplayName}
          </Label>
          <Input
            id="edit-field"
            type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-2"
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
