
import { Recipient } from '@/types/recipient';

export type SortOption = 'latest' | 'name-asc' | 'name-desc' | 'frequent' | 'recent';

export const sortRecipients = (recipients: Recipient[], option: SortOption) => {
  switch (option) {
    case 'name-asc':
      return [...recipients].sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return [...recipients].sort((a, b) => b.name.localeCompare(a.name));
    case 'latest':
      return [...recipients].sort((a, b) => {
        const dateA = a.lastUsed ? new Date(a.lastUsed).getTime() : 0;
        const dateB = b.lastUsed ? new Date(b.lastUsed).getTime() : 0;
        return dateB - dateA;
      });
    case 'frequent':
      // Sort by usage count (frequency of transactions)
      return [...recipients].sort((a, b) => {
        const countA = a.usageCount || 0;
        const countB = b.usageCount || 0;
        return countB - countA;
      });
    case 'recent':
    default:
      // Sort by favorite status first, then by last used date
      return [...recipients].sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        
        const dateA = a.lastUsed ? new Date(a.lastUsed).getTime() : 0;
        const dateB = b.lastUsed ? new Date(b.lastUsed).getTime() : 0;
        return dateB - dateA;
      });
  }
};

export const filterRecipients = (recipients: Recipient[], searchQuery: string, activeTab: string) => {
  return recipients.filter(recipient => {
    const matchesSearch = recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         recipient.contact.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'favorites') return matchesSearch && recipient.isFavorite;
    if (activeTab === 'family') return matchesSearch && recipient.category === 'family';
    if (activeTab === 'business') return matchesSearch && recipient.category === 'business';
    if (activeTab === 'frequent') return matchesSearch && recipient.category === 'frequent';
    return matchesSearch;
  });
};

// New function to verify recipients
export const verifyRecipient = (recipient: Recipient, providerId?: string): { isValid: boolean; message?: string } => {
  // Basic validation
  if (!recipient.name || !recipient.contact) {
    return { isValid: false, message: 'Missing recipient information' };
  }
  
  // Validate based on provider if present
  if (providerId) {
    // Mobile Money validation (simple check for demo)
    if (providerId.includes('mtn') || providerId.includes('orange')) {
      // Check if contact is numeric and has correct format for Cameroon
      const isValidMobileFormat = /^(\+237|237)?[6-9][0-9]{8}$/.test(recipient.contact.replace(/\s/g, ''));
      if (!isValidMobileFormat) {
        return { 
          isValid: false, 
          message: 'Invalid mobile number format. Cameroon mobile numbers should start with 6, 7, 8, or 9 and contain 9 digits.'
        };
      }
    }
    
    // Bank account validation
    if (providerId.includes('bank') || providerId.includes('ecobank') || providerId.includes('afriland') || providerId.includes('uba')) {
      // Simple account number length validation
      const accountNumber = recipient.contact.replace(/\s/g, '');
      if (accountNumber.length < 8 || accountNumber.length > 20) {
        return { 
          isValid: false, 
          message: 'Invalid bank account number format'
        };
      }
    }
  }
  
  return { isValid: true };
};
