
// This file is maintained for backward compatibility
// It re-exports everything from the new modular files

import {
  Recipient,
  getRecipients,
  addRecipient,
  updateRecipient,
  deleteRecipient,
  toggleFavorite,
  updateLastUsed
} from '@/services/recipients/index';

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
