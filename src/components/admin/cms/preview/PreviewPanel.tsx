
import React from 'react';
import { usePreview } from '@/contexts/PreviewContext';
import { X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const PreviewPanel = () => {
  const { isPreviewMode, previewData, togglePreviewMode } = usePreview();

  if (!isPreviewMode) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      {/* Preview Panel */}
      <div className="w-full max-w-2xl bg-white h-full overflow-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-100 to-secondary-100 p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold text-primary-800">Preview Mode</h2>
          <button 
            onClick={togglePreviewMode}
            className="p-1 rounded-full hover:bg-black/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <Tabs defaultValue="desktop" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="desktop">Desktop</TabsTrigger>
              <TabsTrigger value="tablet">Tablet</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="desktop" className="border p-4 rounded-md">
              <div className="aspect-video bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
                {previewData.content ? (
                  <div className="p-4 w-full h-full overflow-auto">
                    <div dangerouslySetInnerHTML={{ __html: previewData.content }} />
                  </div>
                ) : (
                  <p className="text-muted-foreground">No content to preview</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="tablet" className="border p-4 rounded-md">
              <div className="max-w-md mx-auto aspect-[4/3] bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
                {previewData.content ? (
                  <div className="p-4 w-full h-full overflow-auto">
                    <div dangerouslySetInnerHTML={{ __html: previewData.content }} />
                  </div>
                ) : (
                  <p className="text-muted-foreground">No content to preview</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="mobile" className="border p-4 rounded-md">
              <div className="max-w-xs mx-auto aspect-[9/16] bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
                {previewData.content ? (
                  <div className="p-4 w-full h-full overflow-auto">
                    <div dangerouslySetInnerHTML={{ __html: previewData.content }} />
                  </div>
                ) : (
                  <p className="text-muted-foreground">No content to preview</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Preview Data Debug */}
          <div className="mt-8 border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Preview Data</h3>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
              {JSON.stringify(previewData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
