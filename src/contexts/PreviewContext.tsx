
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PreviewContextType {
  isPreviewMode: boolean;
  togglePreviewMode: () => void;
  previewData: any;
  updatePreviewData: (data: any) => void;
}

const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

export const PreviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewData, setPreviewData] = useState<any>({});

  const togglePreviewMode = () => {
    setIsPreviewMode(prev => !prev);
  };

  const updatePreviewData = (data: any) => {
    setPreviewData(prev => ({ ...prev, ...data }));
  };

  return (
    <PreviewContext.Provider value={{ 
      isPreviewMode, 
      togglePreviewMode, 
      previewData, 
      updatePreviewData 
    }}>
      {children}
    </PreviewContext.Provider>
  );
};

export const usePreview = () => {
  const context = useContext(PreviewContext);
  if (context === undefined) {
    throw new Error('usePreview must be used within a PreviewProvider');
  }
  return context;
};
