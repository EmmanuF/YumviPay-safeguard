
// This file exports all recipient-related functionality from the separate modules
import { Recipient } from '@/types/recipient';
import { getRecipients } from './recipientsFetch';
import { addRecipient } from './recipientsCreate';
import { updateRecipient, toggleFavorite, updateLastUsed } from './recipientsUpdate';
import { deleteRecipient } from './recipientsDelete';

// Re-export types
export type { Recipient };

// Re-export all functions
export {
  getRecipients,
  addRecipient,
  updateRecipient,
  deleteRecipient,
  toggleFavorite,
  updateLastUsed
};
