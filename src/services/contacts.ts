
import { Device } from '@capacitor/device';
import { toast } from '@/hooks/use-toast';

export type Contact = {
  id: string;
  name: string;
  phoneNumber?: string;
  email?: string;
};

// This function will handle contact imports in a way that's compatible with our current setup
export const importContacts = async (): Promise<Contact[]> => {
  try {
    // Check if running on a mobile device
    const info = await Device.getInfo();
    const isMobile = info.platform !== 'web';
    
    if (isMobile) {
      // On mobile, we would normally use Capacitor Contacts plugin
      // Since we can't install it, we'll show a toast explaining the situation
      toast({
        title: "Contact Import",
        description: "Contact import is being simulated. In a production app, this would use native contact access.",
        variant: "default"
      });
    }
    
    // For demonstration, return mock contacts
    // In a real app with the plugin, this would return actual contacts
    return simulateMockContacts();
  } catch (error) {
    console.error('Error importing contacts:', error);
    toast({
      title: "Error",
      description: "Failed to import contacts. Please try again later.",
      variant: "destructive"
    });
    return [];
  }
};

// Generate some mock contacts for demonstration
const simulateMockContacts = (): Contact[] => {
  return [
    { id: '1', name: 'John Doe', phoneNumber: '+237612345678', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', phoneNumber: '+237623456789', email: 'jane@example.com' },
    { id: '3', name: 'Michael Johnson', phoneNumber: '+237634567890', email: 'michael@example.com' },
    { id: '4', name: 'Sarah Williams', phoneNumber: '+237645678901', email: 'sarah@example.com' },
    { id: '5', name: 'David Brown', phoneNumber: '+237656789012', email: 'david@example.com' },
  ];
};
