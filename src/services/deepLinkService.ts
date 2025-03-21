
import { App, AppLaunchUrl, URLOpenListenerEvent } from '@capacitor/app';
import { isPlatform } from '@/utils/platformUtils';

/**
 * Deep linking service for handling app URLs and external navigations
 */
export class DeepLinkService {
  private static instance: DeepLinkService;
  private initialUrl: string | null = null;
  private listeners: ((url: string) => void)[] = [];

  private constructor() {
    // Initialize listeners when on a native platform
    if (isPlatform('mobile')) {
      this.setupListeners();
    }
  }

  /**
   * Get the singleton instance of DeepLinkService
   */
  public static getInstance(): DeepLinkService {
    if (!DeepLinkService.instance) {
      DeepLinkService.instance = new DeepLinkService();
    }
    return DeepLinkService.instance;
  }

  /**
   * Set up app URL open listeners
   */
  private setupListeners(): void {
    // Listen for deep link when app is active
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.handleIncomingUrl(event.url);
    });

    // Get initial URL that launched the app
    App.getLaunchUrl().then((result: AppLaunchUrl | null) => {
      if (result && result.url) {
        this.initialUrl = result.url;
        this.handleIncomingUrl(result.url);
      }
    });
  }

  /**
   * Handle incoming URL
   * @param url - The URL that opened the app
   */
  private handleIncomingUrl(url: string): void {
    console.log('Deep link received:', url);
    
    // Notify all listeners about the URL
    this.listeners.forEach(listener => listener(url));
  }

  /**
   * Get the initial URL that launched the app
   */
  public getInitialUrl(): string | null {
    return this.initialUrl;
  }

  /**
   * Add a listener for deep link events
   * @param listener - Function to call when a deep link is received
   * @returns Function to remove the listener
   */
  public addListener(listener: (url: string) => void): () => void {
    this.listeners.push(listener);
    
    // Return function to remove this listener
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Generate a deep link URL for the app
   * @param path - The path within the app
   * @param params - Query parameters to include
   * @returns Full deep link URL
   */
  public generateDeepLink(path: string, params?: Record<string, string>): string {
    // Base deep link URL with custom scheme for the app
    let url = `yumvipay://${path}`;
    
    // Add query parameters if provided
    if (params && Object.keys(params).length > 0) {
      const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      
      url += `?${queryString}`;
    }
    
    return url;
  }

  /**
   * Extract path and parameters from a deep link URL
   * @param url - The deep link URL
   * @returns Object containing path and params
   */
  public parseDeepLink(url: string): { path: string; params: Record<string, string> } {
    try {
      // Parse the URL
      const parsedUrl = new URL(url);
      
      // Get the path (removing leading slash if present)
      const path = parsedUrl.pathname.startsWith('/') 
        ? parsedUrl.pathname.substring(1) 
        : parsedUrl.pathname;
      
      // Parse query parameters
      const params: Record<string, string> = {};
      parsedUrl.searchParams.forEach((value, key) => {
        params[key] = value;
      });
      
      return { path, params };
    } catch (error) {
      console.error('Error parsing deep link URL:', error);
      return { path: '', params: {} };
    }
  }
}

// Export singleton instance
export const deepLinkService = DeepLinkService.getInstance();
