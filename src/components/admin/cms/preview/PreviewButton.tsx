
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { usePreview } from '@/contexts/PreviewContext';

const PreviewButton = () => {
  const { isPreviewMode, togglePreviewMode } = usePreview();

  return (
    <Button 
      onClick={togglePreviewMode}
      variant={isPreviewMode ? "secondary" : "outline"}
      className={`flex items-center gap-2 ${isPreviewMode ? 'bg-secondary text-white' : ''}`}
    >
      {isPreviewMode ? (
        <>
          <EyeOff className="h-4 w-4" />
          <span>Exit Preview</span>
        </>
      ) : (
        <>
          <Eye className="h-4 w-4" />
          <span>Preview Changes</span>
        </>
      )}
    </Button>
  );
};

export default PreviewButton;
