
import React from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SavePreferenceToggleProps {
  savePreference: boolean;
  handleToggleSavePreference: (checked: boolean) => void;
}

const SavePreferenceToggle: React.FC<SavePreferenceToggleProps> = ({
  savePreference,
  handleToggleSavePreference
}) => {
  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <motion.div variants={itemVariants} className="flex items-center justify-between mt-4 p-3 bg-muted/50 rounded-lg">
      <div>
        <Label htmlFor="save-preference" className="text-sm font-medium">
          Save as preferred payment method
        </Label>
        <p className="text-xs text-muted-foreground mt-0.5">
          This will be pre-selected for future transactions
        </p>
      </div>
      <Switch 
        id="save-preference" 
        checked={savePreference} 
        onCheckedChange={handleToggleSavePreference}
      />
    </motion.div>
  );
};

export default SavePreferenceToggle;
