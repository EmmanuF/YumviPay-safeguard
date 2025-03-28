
import React from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';

interface PreferenceToggleProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon: React.ReactNode;
  accentColor?: "primary" | "secondary" | "yellow" | "purple" | string;
}

const PreferenceToggle: React.FC<PreferenceToggleProps> = ({
  title,
  description,
  checked,
  onChange,
  icon,
  accentColor = 'primary'
}) => {
  const isMobile = useIsMobile();

  // Define background color for the icon container based on accentColor
  const getIconBgClass = () => {
    switch (accentColor) {
      case 'secondary': return 'bg-secondary-50';
      case 'yellow': return 'bg-yellow-50';
      case 'purple': return 'bg-purple-50';
      default: return 'bg-primary-50';
    }
  };

  // Define text color based on accentColor
  const getTitleTextClass = () => {
    switch (accentColor) {
      case 'secondary': return 'text-secondary-700';
      case 'yellow': return 'text-yellow-700';
      case 'purple': return 'text-purple-700';
      default: return 'text-primary-700';
    }
  };
  
  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100/80 mt-4"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`${isMobile ? 'flex-col space-y-3' : 'flex items-center justify-between'}`}>
        <div className="flex items-center">
          <div className={`${getIconBgClass()} p-2 rounded-full mr-3`}>
            {icon}
          </div>
          <div>
            <Label className={`font-medium ${getTitleTextClass()} text-base`}>{title}</Label>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
        <Switch
          checked={checked}
          onCheckedChange={onChange}
          accentColor={accentColor}
          className={`${!isMobile ? 'ml-auto' : 'mt-2'}`}
        />
      </div>
    </motion.div>
  );
};

export default PreferenceToggle;
