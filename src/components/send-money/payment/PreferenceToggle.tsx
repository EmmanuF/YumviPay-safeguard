
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
  accentColor?: string;
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
  
  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100/80 mt-4"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`${isMobile ? 'flex-col space-y-3' : 'flex items-center justify-between'}`}>
        <div className="flex items-center">
          <div className={`bg-${accentColor}-50 p-2 rounded-full mr-3`}>
            {icon}
          </div>
          <div>
            <Label className={`font-medium text-${accentColor}-700 text-base`}>{title}</Label>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
        <Switch
          checked={checked}
          onCheckedChange={onChange}
          className={`data-[state=checked]:bg-${accentColor}-500 ${!isMobile ? 'ml-auto' : 'mt-2'}`}
        />
      </div>
    </motion.div>
  );
};

export default PreferenceToggle;
