
import { useEffect, useState, useCallback } from 'react';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { isPlatform } from '@/utils/platformUtils';
import { deepLinkService } from '@/services/deepLinkService';

interface DeepLinkParams {
  path: string;
  params: Record<string, string>;
}

/**
 * Hook to handle deep links in the application
 * @param onDeepLink Optional callback to handle deep links
 * @returns Deep link handling utilities
 */
export const useDeepLinks = (onDeepLink?: (data: DeepLinkParams) => void) => {
  const [initialUrl, setInitialUrl] = useState<string | null>(null);
  const [lastDeepLink, setLastDeepLink] = useState<DeepLinkParams | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Parse deep link URL
  const parseDeepLink = useCallback((url: string): DeepLinkParams => {
    return deepLinkService.parseDeepLink(url);
  }, []);

  // Generate deep link URL
  const generateDeepLink = useCallback(
    (path: string, params?: Record<string, string>): string => {
      return deepLinkService.generateDeepLink(path, params);
    },
    []
  );

  // Handle incoming deep link
  const handleDeepLink = useCallback(
    (url: string) => {
      console.log('Deep link received:', url);
      const parsedData = parseDeepLink(url);
      setLastDeepLink(parsedData);
      
      if (onDeepLink) {
        onDeepLink(parsedData);
      }
    },
    [onDeepLink, parseDeepLink]
  );

  // Set up deep link handling
  useEffect(() => {
    if (!isPlatform('mobile')) {
      setIsReady(true);
      return;
    }

    // Get initial URL that launched the app
    App.getLaunchUrl().then(result => {
      if (result && result.url) {
        setInitialUrl(result.url);
        handleDeepLink(result.url);
      }
      setIsReady(true);
    });

    // Listen for deep links while app is active
    let listenerCleanup: (() => void) | undefined;
    
    // The addListener method returns a promise that resolves to a PluginListenerHandle
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      handleDeepLink(event.url);
    }).then(listener => {
      // Store the remove function for cleanup
      listenerCleanup = () => listener.remove();
    });

    // Cleanup
    return () => {
      if (listenerCleanup) {
        listenerCleanup();
      }
    };
  }, [handleDeepLink]);

  return {
    initialUrl,
    lastDeepLink,
    isReady,
    parseDeepLink,
    generateDeepLink
  };
};
