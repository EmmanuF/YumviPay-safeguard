
import React from 'react';
import { Star } from 'lucide-react';
import PreferenceToggle from './PreferenceToggle';

interface SavePreferenceToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SavePreferenceToggle: React.FC<SavePreferenceToggleProps> = ({
  checked,
  onChange
}) => {
  return (
    <PreferenceToggle
      title="Save as preferred payment method"
      description="This will be pre-selected for future transactions"
      checked={checked}
      onChange={onChange}
      icon={<Star className="h-5 w-5 text-yellow-500" />}
      accentColor="yellow"
    />
  );
};

export default SavePreferenceToggle;
