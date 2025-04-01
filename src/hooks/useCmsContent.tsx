
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface CmsContent {
  id: string;
  type: string;
  key: string;
  title: string;
  content: any;
  status: string;
  category?: string;
  page?: string;
  created_at: string;
  updated_at: string;
}

interface UseCmsContentOptions {
  type?: string;
  key?: string;
  page?: string;
  category?: string;
}

interface UseCmsContentReturn {
  content: CmsContent | null;
  contents: CmsContent[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook to fetch and use CMS content
 * 
 * @param options Options for filtering content
 * @returns CMS content and status
 */
export const useCmsContent = (options?: UseCmsContentOptions): UseCmsContentReturn => {
  const [content, setContent] = useState<CmsContent | null>(null);
  const [contents, setContents] = useState<CmsContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query based on options
      let query = supabase
        .from('cms_content')
        .select('*')
        .eq('status', 'published');
      
      if (options?.type) {
        query = query.eq('type', options.type);
      }
      
      if (options?.key) {
        query = query.eq('key', options.key);
      }
      
      if (options?.page) {
        query = query.eq('page', options.page);
      }
      
      if (options?.category) {
        query = query.eq('category', options.category);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      
      // Single content item if key is provided
      if (options?.key && data && data.length > 0) {
        setContent(data[0] as CmsContent);
      } else {
        setContent(null);
      }
      
      setContents(data as CmsContent[] || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load content';
      console.error('Error fetching CMS content:', errorMessage);
      setError(errorMessage);
      toast({
        title: "Content Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [options?.type, options?.key, options?.page, options?.category, toast]);
  
  useEffect(() => {
    fetchContent();
  }, [fetchContent]);
  
  return {
    content,
    contents,
    loading,
    error,
    refresh: fetchContent,
  };
};

export default useCmsContent;
