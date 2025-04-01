
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string | null;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Hook to check if a feature flag is enabled
 * 
 * @param flagKey The key of the feature flag to check
 * @returns Object containing flag status
 */
export const useFeatureFlag = (flagKey: string) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkFeatureFlag = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error: fetchError } = await supabase
        .from('feature_flags')
        .select('enabled')
        .eq('key', flagKey)
        .single();
      
      if (fetchError) {
        if (fetchError.code === 'PGRST116') { // No rows returned
          console.warn(`Feature flag "${flagKey}" not found`);
          setIsEnabled(false);
        } else {
          throw fetchError;
        }
      } else {
        setIsEnabled(data?.enabled || false);
      }
    } catch (error) {
      console.error(`Error checking feature flag ${flagKey}:`, error);
      setError(`Failed to check feature flag: ${flagKey}`);
      setIsEnabled(false);
    } finally {
      setLoading(false);
    }
  }, [flagKey]);

  useEffect(() => {
    checkFeatureFlag();
  }, [checkFeatureFlag]);

  return { isEnabled, loading, error, refresh: checkFeatureFlag };
};

/**
 * Hook to get all feature flags
 * 
 * @returns Object containing all feature flags
 */
export const useFeatureFlags = () => {
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatureFlags = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error: fetchError } = await supabase
        .from('feature_flags')
        .select('key, enabled');
      
      if (fetchError) {
        throw fetchError;
      }
      
      const flags: Record<string, boolean> = {};
      if (data) {
        data.forEach((flag: any) => {
          flags[flag.key] = flag.enabled;
        });
      }
      
      setFeatureFlags(flags);
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      setError('Failed to load feature flags');
      setFeatureFlags({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatureFlags();
  }, [fetchFeatureFlags]);

  return { 
    featureFlags, 
    loading, 
    error, 
    refresh: fetchFeatureFlags,
    isEnabled: (key: string) => featureFlags[key] ?? false
  };
};

export default useFeatureFlag;
