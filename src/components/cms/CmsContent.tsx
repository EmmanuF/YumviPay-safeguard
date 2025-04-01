
import React from 'react';
import { useCmsContent } from '@/hooks/useCmsContent';
import { Skeleton } from '@/components/ui/skeleton';

interface CmsContentProps {
  type: string;
  contentKey: string;
  fallback?: React.ReactNode;
  renderContent?: (content: any) => React.ReactNode;
}

/**
 * Component to render CMS content
 */
const CmsContent: React.FC<CmsContentProps> = ({ 
  type, 
  contentKey, 
  fallback, 
  renderContent 
}) => {
  const { content, loading, error } = useCmsContent({ 
    type, 
    key: contentKey 
  });
  
  if (loading) {
    return (
      <div className="animate-pulse">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    );
  }
  
  if (error || !content) {
    return <>{fallback}</>;
  }
  
  // If custom renderer is provided, use it
  if (renderContent) {
    return <>{renderContent(content.content)}</>;
  }
  
  // Default rendering based on content type
  if (typeof content.content === 'string') {
    return <div dangerouslySetInnerHTML={{ __html: content.content }} />;
  }
  
  if (typeof content.content === 'object') {
    // Handle image
    if (content.type === 'image' && content.content.url) {
      return <img 
        src={content.content.url} 
        alt={content.content.alt || content.title} 
        className={content.content.className || ''} 
      />;
    }
    
    // Handle FAQ
    if (content.type === 'faq' && Array.isArray(content.content.items)) {
      return (
        <div className="space-y-4">
          {content.content.items.map((item: any, index: number) => (
            <div key={index} className="border-b pb-3">
              <h3 className="font-medium">{item.question}</h3>
              <p className="text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      );
    }
  }
  
  // Fallback for unknown content types
  return <pre className="text-xs">{JSON.stringify(content.content, null, 2)}</pre>;
};

export default CmsContent;
