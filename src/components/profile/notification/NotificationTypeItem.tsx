
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LucideIcon } from 'lucide-react';

interface NotificationTypeItemProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id: string;
}

const NotificationTypeItem: React.FC<NotificationTypeItemProps> = ({
  icon,
  label,
  description,
  checked,
  onChange,
  disabled = false,
  id
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start space-x-3">
        {icon}
        <div>
          <Label htmlFor={id} className="font-medium">{label}</Label>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

export default NotificationTypeItem;
