
import { Device } from '@capacitor/device';
import { isPlatform } from '@/utils/platformUtils';
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
    const isMobile = isPlatform('native');
    
    if (isMobile) {
      // On mobile, we would normally use Capacitor Contacts plugin
      // For now, just return mock contacts but simulate a delay to mimic real API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Log information about the current platform
      console.log('Platform:', await Device.getInfo());
      
      // Return mock contacts
      return getMockContacts();
    } else {
      // For web preview, return fewer mock contacts more quickly
      await new Promise(resolve => setTimeout(resolve, 800));
      return getMockContacts(8);
    }
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
const getMockContacts = (count = 15): Contact[] => {
  const mockContacts: Contact[] = [
    { id: '1', name: 'John Doe', phoneNumber: '+237612345678', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', phoneNumber: '+237623456789', email: 'jane@example.com' },
    { id: '3', name: 'Michael Johnson', phoneNumber: '+237634567890', email: 'michael@example.com' },
    { id: '4', name: 'Sarah Williams', phoneNumber: '+237645678901', email: 'sarah@example.com' },
    { id: '5', name: 'David Brown', phoneNumber: '+237656789012', email: 'david@example.com' },
    { id: '6', name: 'Emma Davis', phoneNumber: '+237667890123', email: 'emma@example.com' },
    { id: '7', name: 'Robert Wilson', phoneNumber: '+237678901234', email: 'robert@example.com' },
    { id: '8', name: 'Jennifer Taylor', phoneNumber: '+237689012345', email: 'jennifer@example.com' },
    { id: '9', name: 'William Martinez', phoneNumber: '+237690123456', email: 'william@example.com' },
    { id: '10', name: 'Linda Anderson', phoneNumber: '+237701234567', email: 'linda@example.com' },
    { id: '11', name: 'James Thomas', phoneNumber: '+237712345678', email: 'james@example.com' },
    { id: '12', name: 'Patricia Jackson', phoneNumber: '+237723456789', email: 'patricia@example.com' },
    { id: '13', name: 'Richard White', phoneNumber: '+237734567890', email: 'richard@example.com' },
    { id: '14', name: 'Barbara Harris', phoneNumber: '+237745678901', email: 'barbara@example.com' },
    { id: '15', name: 'Charles Clark', phoneNumber: '+237756789012', email: 'charles@example.com' },
  ];
  
  // Return requested number of contacts, or all if count is larger than available contacts
  return mockContacts.slice(0, Math.min(count, mockContacts.length));
};

// For future implementation with real Capacitor Contacts plugin
export const requestContactsPermission = async (): Promise<boolean> => {
  // In a real implementation, this would request permission using the plugin
  // For now, we'll simulate success
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
};
