
// Utility functions for authentication

/**
 * Validates if an email is properly formatted
 * @param email Email to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Creates a modified email for testing purposes
 * Adds a timestamp to make the email unique
 * @param email Original email
 * @returns Modified email for testing
 */
export const createModifiedEmail = (email: string): string => {
  const timestamp = new Date().getTime();
  const [username, domain] = email.split('@');
  return `${username}+${timestamp}@${domain}`;
};

/**
 * Generates a secure random password
 * @returns Secure random password
 */
export const generateSecurePassword = (): string => {
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `YumviUser_${randomPart}`;
};
