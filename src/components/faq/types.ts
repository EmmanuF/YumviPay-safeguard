
// Define the question categories
export type QuestionCategory = 'all' | 'getting-started' | 'transactions' | 'account' | 'payments' | 'security';

// Define the FAQ item structure
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: Exclude<QuestionCategory, 'all'>;
}
