
import React from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecipientAvatarProps {
  name: string;
  className?: string;
}

const RecipientAvatar: React.FC<RecipientAvatarProps> = ({ name, className }) => {
  return (
    <div className={cn(
      "w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center",
      className
    )}>
      <User className="h-5 w-5 text-primary-500" />
    </div>
  );
};

export default RecipientAvatar;
