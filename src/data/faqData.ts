
export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const faqCategories = [
  { id: 'all', name: 'All Categories' },
  { id: 'general', name: 'General Information' },
  { id: 'account', name: 'Account Management' },
  { id: 'transfers', name: 'Money Transfers' },
  { id: 'payments', name: 'Payments & Fees' },
  { id: 'security', name: 'Security & Privacy' },
  { id: 'support', name: 'Customer Support' }
];

export const faqItems: FAQItem[] = [
  {
    question: "How does Yumvi-Pay work?",
    answer: "Yumvi-Pay is a mobile app that lets you send money to Africa. You register, complete a quick KYC process through our partner Kado, and then you can send money to your recipients. We handle the currency conversion and ensure the money reaches your loved ones quickly and securely.",
    category: "general"
  },
  {
    question: "How long does a transfer take?",
    answer: "Most transfers are completed within minutes. However, depending on the payment method and recipient's location, some transfers might take up to 24 hours. You can track the status of your transfer in real-time through the app.",
    category: "transfers"
  },
  {
    question: "What payment methods can I use?",
    answer: "We support various payment methods including mobile money (MTN Mobile Money, Orange Money), bank transfers, and credit/debit cards. Available payment methods may vary depending on your location and the recipient's country.",
    category: "payments"
  },
  {
    question: "What are the fees for sending money?",
    answer: "Our fee structure is transparent and depends on the amount you're sending, the payment method, and the destination country. You'll always see the exact fee before confirming your transfer. We strive to offer competitive rates that are typically lower than traditional money transfer services.",
    category: "payments"
  },
];
