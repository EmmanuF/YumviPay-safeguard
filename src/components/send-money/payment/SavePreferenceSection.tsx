
import React from 'react';
import SavePreferenceToggle from './SavePreferenceToggle';

interface SavePreferenceSectionProps {
  showSection: boolean;
  savePreference: boolean;
  onToggle: (save: boolean) => void;
}

const SavePreferenceSection: React.FC<SavePreferenceSectionProps> = ({
  showSection,
  savePreference,
  onToggle
}) => {
  if (!showSection) {
    return null;
  }

  return (
    <div className="mt-6">
      <SavePreferenceToggle
        checked={savePreference}
        onChange={onToggle}
      />
    </div>
  );
};

export default SavePreferenceSection;
