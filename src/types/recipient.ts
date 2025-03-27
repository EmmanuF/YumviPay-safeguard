
export interface Recipient {
  id: string;
  name: string;
  contact: string; // Mobile number or email
  country: string;
  isFavorite: boolean;
  category?: string; // 'family', 'business', 'frequent'
  lastUsed?: Date;
  usageCount?: number; // Track frequency of use
  verified?: boolean; // Track verification status
  nameMatchConfirmed?: boolean; // New field to confirm recipient name matches ID
}
