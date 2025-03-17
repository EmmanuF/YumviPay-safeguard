
import { Recipient } from '@/types/recipient';

export type SortOption = 'latest' | 'name-asc' | 'name-desc' | 'recent';

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
    return matchesSearch;
  });
};
