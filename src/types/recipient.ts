
export interface Recipient {
  id: string;
  name: string;
  contact: string; // Mobile number or email
  country: string;
  isFavorite: boolean;
  lastUsed?: Date;
}
