
import { Share } from '@capacitor/share';
import { Device } from '@capacitor/device';
import { isPlatform } from '@/utils/platformUtils';
import { toast } from '@/hooks/use-toast';

/**
 * Service to handle native sharing functionality
 */
export const NativeSharingService = {
  /**
   * Check if native sharing is available on the device
   */
  isAvailable: async (): Promise<boolean> => {
    // First check if we're in a Capacitor context (native platform)
    if (!isPlatform('capacitor')) {
      return false;
    }
    
    try {
      // Check if the Share plugin is available (which it should be on mobile)
      const canShareResult = await Share.canShare();
      return canShareResult.value;
    } catch (error) {
      console.error('Error checking share availability:', error);
      return false;
    }
  },
  
  /**
   * Share content using the native sharing dialog
   */
  shareContent: async (options: {
    title?: string;
    text?: string;
    url?: string;
    files?: string[]; // Array of file URLs
    dialogTitle?: string;
  }): Promise<boolean> => {
    try {
      // First check if native sharing is available
      const isAvailable = await NativeSharingService.isAvailable();
      
      if (!isAvailable) {
        console.log('Native sharing not available, using fallback...');
        return await NativeSharingService.fallbackShare(options);
      }
      
      // Use native sharing
      await Share.share({
        title: options.title,
        text: options.text,
        url: options.url,
        files: options.files,
        dialogTitle: options.dialogTitle,
      });
      
      return true;
    } catch (error) {
      console.error('Error sharing content:', error);
      
      // Try fallback method
      return await NativeSharingService.fallbackShare(options);
    }
  },
  
  /**
   * Fallback sharing method when native sharing is not available
   */
  fallbackShare: async (options: {
    title?: string;
    text?: string;
    url?: string;
    files?: string[];
    dialogTitle?: string;
  }): Promise<boolean> => {
    try {
      // If we have a URL, try the Web Share API
      if (options.url && typeof navigator.share === 'function') {
        await navigator.share({
          title: options.title,
          text: options.text,
          url: options.url,
        });
        return true;
      }
      
      // If no URL or Web Share API not available, just copy to clipboard
      if (options.url) {
        await navigator.clipboard.writeText(options.url);
        toast({
          title: "Copied to clipboard",
          description: "The link has been copied to your clipboard",
        });
        return true;
      } else if (options.text) {
        await navigator.clipboard.writeText(options.text);
        toast({
          title: "Copied to clipboard",
          description: "The text has been copied to your clipboard",
        });
        return true;
      }
      
      // If we have neither URL nor text, show an error
      toast({
        title: "Unable to share",
        description: "No content available to share",
        variant: "destructive"
      });
      return false;
    } catch (error) {
      console.error('Error with fallback sharing:', error);
      
      toast({
        title: "Unable to share",
        description: "The sharing feature is not available on this device",
        variant: "destructive"
      });
      return false;
    }
  },
  
  /**
   * Share a transaction receipt
   */
  shareTransactionReceipt: async (transaction: {
    id: string;
    amount: number | string;
    recipientName: string;
    status: string;
  }): Promise<boolean> => {
    return await NativeSharingService.shareContent({
      title: `Yumvi Pay Transfer - ${transaction.id}`,
      text: `I sent $${transaction.amount} to ${transaction.recipientName} via Yumvi Pay. Status: ${transaction.status}`,
      dialogTitle: "Share Transaction Receipt"
    });
  }
};
