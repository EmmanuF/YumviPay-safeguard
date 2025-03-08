
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProfileNavItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  rightIcon?: React.ReactNode;
}

const ProfileNavItem: React.FC<ProfileNavItemProps> = ({
  icon,
  title,
  description,
  onClick,
  rightIcon
}) => {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "bg-card rounded-lg p-4 flex items-center cursor-pointer",
        "hover:bg-accent/50 transition-colors"
      )}
    >
      <div className="w-10 h-10 rounded-full bg-primary-50/50 flex items-center justify-center mr-4">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {rightIcon}
    </motion.div>
  );
};

export default ProfileNavItem;
