
import { format, isValid, parseISO } from 'date-fns';

export const formatNumber = (value: number, locale = 'en-US'): string => {
  return new Intl.NumberFormat(locale).format(value);
};

export const formatCurrency = (
  value: number,
  currency = 'USD',
  locale = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPercentage = (
  value: number,
  locale = 'en-US',
  minimumFractionDigits = 0,
  maximumFractionDigits = 2
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value / 100);
};

export const formatDate = (
  date: Date | string | number,
  dateFormat = 'MMM d, yyyy',
  fallback = 'Invalid date'
): string => {
  try {
    if (!date) return fallback;
    
    // Parse string dates if needed
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    
    // Validate date
    if (!isValid(parsedDate)) return fallback;
    
    // Format the date
    return format(parsedDate, dateFormat);
  } catch (error) {
    console.error('Error formatting date:', error);
    return fallback;
  }
};

export const formatPhoneNumber = (
  phoneNumber: string,
  countryCode = 'US'
): string => {
  // Basic phone formatting - could be expanded for different countries
  if (!phoneNumber) return '';
  
  // Strip non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // US phone format: (XXX) XXX-XXXX
  if (countryCode === 'US' && cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Default formatting for other countries or formats
  return phoneNumber;
};

export const capitalizeFirstLetter = (string: string): string => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};
